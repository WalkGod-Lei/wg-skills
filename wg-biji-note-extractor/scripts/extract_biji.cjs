#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const HELP = `
Usage:
  node extract_biji.cjs --url <subject-url> --leveldb <snapshot-dir> --out <file.json> [options]

Required:
  --url <url>             biji.com/subject URL containing followId
  --out <path>            Destination JSON file
  --leveldb <dir>         Read-only Chrome Local Storage LevelDB snapshot
                          (optional only when BIJI_TOKEN is set)

Options:
  --expected <number>     Fail when the list count differs
  --concurrency <1..12>   Detail request workers (default: 6)
  --page-size <1..50>     List page size (default: 50)
  --retries <0..5>        Retries for transient failures (default: 3)
  --timeout-ms <number>   Per-request timeout, 1000..120000 (default: 30000)
  --strict                Exit non-zero if title, original text, or summary is empty
  --force                 Replace an existing destination file
  --help                  Show this message

Sensitive fallback environment variables (never printed):
  BIJI_TOKEN, BIJI_REFRESH_TOKEN, BIJI_DEVICE_ID
`;

function parseArgs(argv) {
  const options = { concurrency: 6, pageSize: 50, retries: 3, timeoutMs: 30000, strict: false, force: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--strict') options.strict = true;
    else if (arg === '--force') options.force = true;
    else {
      const value = argv[++i];
      if (value === undefined) throw new Error(`Missing value for ${arg}`);
      if (arg === '--url') options.url = value;
      else if (arg === '--leveldb') options.leveldb = value;
      else if (arg === '--out') options.out = value;
      else if (arg === '--expected') options.expected = Number(value);
      else if (arg === '--concurrency') options.concurrency = Number(value);
      else if (arg === '--page-size') options.pageSize = Number(value);
      else if (arg === '--retries') options.retries = Number(value);
      else if (arg === '--timeout-ms') options.timeoutMs = Number(value);
      else throw new Error(`Unknown option: ${arg}`);
    }
  }
  return options;
}

function validateOptions(options) {
  if (!options.url) throw new Error('--url is required');
  if (!options.out) throw new Error('--out is required');
  if (!options.leveldb && !process.env.BIJI_TOKEN) {
    throw new Error('--leveldb is required unless BIJI_TOKEN is set');
  }
  if (options.expected !== undefined && (!Number.isInteger(options.expected) || options.expected < 0)) {
    throw new Error('--expected must be a non-negative integer');
  }
  if (!Number.isInteger(options.concurrency) || options.concurrency < 1 || options.concurrency > 12) {
    throw new Error('--concurrency must be an integer from 1 to 12');
  }
  if (!Number.isInteger(options.pageSize) || options.pageSize < 1 || options.pageSize > 50) {
    throw new Error('--page-size must be an integer from 1 to 50');
  }
  if (!Number.isInteger(options.retries) || options.retries < 0 || options.retries > 5) {
    throw new Error('--retries must be an integer from 0 to 5');
  }
  if (!Number.isInteger(options.timeoutMs) || options.timeoutMs < 1000 || options.timeoutMs > 120000) {
    throw new Error('--timeout-ms must be an integer from 1000 to 120000');
  }
}

function preflightOutput(output, force) {
  const outputPath = path.resolve(output);
  if (fs.existsSync(outputPath)) {
    if (fs.statSync(outputPath).isDirectory()) throw new Error(`Output path is a directory: ${outputPath}`);
    if (!force) throw new Error(`Output already exists; choose a new path or pass --force: ${outputPath}`);
    fs.accessSync(outputPath, fs.constants.W_OK);
  }
  let existingParent = path.dirname(outputPath);
  while (!fs.existsSync(existingParent)) {
    const parent = path.dirname(existingParent);
    if (parent === existingParent) throw new Error(`Cannot find an existing parent for output: ${outputPath}`);
    existingParent = parent;
  }
  if (!fs.statSync(existingParent).isDirectory()) {
    throw new Error(`Output parent is not a directory: ${existingParent}`);
  }
  fs.accessSync(existingParent, fs.constants.W_OK);
  return outputPath;
}

function parseSubjectUrl(input) {
  let parsed;
  try {
    parsed = new URL(input);
  } catch {
    throw new Error('Invalid URL');
  }
  if (!/(^|\.)biji\.com$/i.test(parsed.hostname)) {
    throw new Error('URL must use the biji.com domain');
  }
  const match = parsed.pathname.match(/\/subject\/([^/]+)/i);
  if (!match) throw new Error('URL must contain /subject/<alias>');
  const topicAlias = decodeURIComponent(match[1]);
  const followIdRaw = parsed.searchParams.get('followId') || parsed.searchParams.get('follow_id');
  if (!followIdRaw || !/^\d+$/.test(followIdRaw)) {
    throw new Error('URL is missing a numeric followId query parameter');
  }
  const followId = Number(followIdRaw);
  if (!Number.isSafeInteger(followId)) throw new Error('followId is outside the safe integer range');
  return { subjectUrl: parsed.toString(), topicAlias, followId };
}

function decodeLocalStorageValue(buffer) {
  if (!buffer || buffer.length === 0) return '';
  const raw = buffer.subarray(1);
  const utf8 = raw.toString('utf8').replace(/\u0000+$/g, '');
  if (/^[\x20-\x7e]+$/.test(utf8)) return utf8;
  return raw.toString('utf16le').replace(/\u0000+$/g, '');
}

async function readAuthFromLevelDb(dbPath) {
  let Level;
  try {
    ({ Level } = require('level'));
  } catch {
    throw new Error('Cannot load level@10. Install it in a temporary directory and set NODE_PATH to that node_modules directory.');
  }

  const resolved = path.resolve(dbPath);
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
    throw new Error(`LevelDB snapshot directory not found: ${resolved}`);
  }
  const snapshotFiles = fs.readdirSync(resolved);
  const hasDataFile = snapshotFiles.some((name) => /\.(?:ldb|log)$/i.test(name)
    && fs.statSync(path.join(resolved, name)).size > 0);
  if (!snapshotFiles.includes('CURRENT') || !hasDataFile) {
    throw new Error('LevelDB snapshot is incomplete: copy the entire source directory before running the extractor');
  }

  const db = new Level(resolved, {
    keyEncoding: 'buffer',
    valueEncoding: 'buffer',
    readOnly: true,
    createIfMissing: false,
  });
  const auth = {};
  const exactKeys = {
    ['_https://www.biji.com\x00\x01token']: 'token',
    ['_https://www.biji.com\x00\x01refresh_token']: 'refresh_token',
    ['_https://www.biji.com\x00\x01device_id']: 'device_id',
  };
  await db.open();
  try {
    for await (const [keyBuffer, valueBuffer] of db.iterator()) {
      const key = keyBuffer.toString('utf8');
      const name = exactKeys[key];
      if (name) auth[name] = decodeLocalStorageValue(valueBuffer);
    }
  } finally {
    await db.close();
  }
  return auth;
}

function requestHeaders(token, deviceId, json = false) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    'X-Appid': '3',
    'X-Av': '1.2.2',
    'Xi-App-Client-Source': 'getnote',
    'Xi-Client-Source': 'web',
    'X-Request-ID': crypto.randomUUID(),
    ...(deviceId ? { 'x-d': deviceId } : {}),
  };
}

function apiMessage(body, status) {
  const value = body?.h?.e || body?.h?.m || body?.message || body?.error || `HTTP ${status}`;
  return String(value).slice(0, 240);
}

function isApiSuccess(response, body) {
  const code = body?.h?.c;
  return response.ok && (code === undefined || Number(code) === 0);
}

function waitForRetry(milliseconds, signal) {
  if (!signal) return new Promise((resolve) => setTimeout(resolve, milliseconds));
  if (signal.aborted) return Promise.reject(new Error('Request batch cancelled'));
  return new Promise((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timer);
      signal.removeEventListener('abort', onAbort);
      reject(new Error('Request batch cancelled'));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, milliseconds);
    signal.addEventListener('abort', onAbort, { once: true });
    if (signal.aborted) onAbort();
  });
}

async function requestJson({ url, method = 'GET', token, deviceId, body, label, retries, timeoutMs, signal }) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const forwardAbort = () => controller.abort();
    if (signal) {
      if (signal.aborted) controller.abort();
      else signal.addEventListener('abort', forwardAbort, { once: true });
    }
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders(token, deviceId, body !== undefined),
        signal: controller.signal,
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      });
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        const error = new Error(`${label}: response was not JSON (HTTP ${response.status})`);
        error.status = response.status;
        throw error;
      }
      if (isApiSuccess(response, data)) return data;
      const error = new Error(`${label}: ${apiMessage(data, response.status)} (HTTP ${response.status})`);
      error.status = response.status;
      const retryAfter = Number(response.headers.get('retry-after'));
      if (Number.isFinite(retryAfter) && retryAfter >= 0) error.retryAfterMs = retryAfter * 1000;
      throw error;
    } catch (error) {
      lastError = error;
      const status = Number(error.status || 0);
      const retryable = status === 0 || status === 429 || status >= 500;
      if (signal?.aborted || attempt >= retries || !retryable) break;
      const backoff = Math.max(Number(error.retryAfterMs || 0), 350 * (2 ** attempt));
      const jitter = Math.floor(Math.random() * 151);
      await waitForRetry(backoff + jitter, signal);
    } finally {
      clearTimeout(timeout);
      if (signal) signal.removeEventListener('abort', forwardAbort);
    }
  }
  throw lastError;
}

function firstString(...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function firstNumber(...values) {
  for (const value of values) {
    const number = Number(value);
    if (Number.isFinite(number) && number > 0) return number;
  }
  return 0;
}

function postIdOf(post) {
  const value = post?.post_id_str ?? post?.post_id_alias ?? post?.post_id;
  return value === undefined || value === null ? '' : String(value);
}

function formatTimestamp(value) {
  let timestamp = Number(value || 0);
  if (!Number.isFinite(timestamp) || timestamp <= 0) return '';
  if (timestamp < 1e12) timestamp *= 1000;
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date).replaceAll('/', '-');
}

function refreshedToken(body) {
  const candidates = [
    body?.c?.token?.token,
    body?.c?.token,
    body?.c?.data?.token?.token,
    body?.c?.data?.token,
    body?.data?.token?.token,
    body?.data?.token,
    body?.token?.token,
    body?.token,
  ];
  return candidates.find((value) => typeof value === 'string' && value.length > 20) || '';
}

async function refreshAccessToken(auth, retries, timeoutMs) {
  if (!auth.refresh_token) return auth.token;
  try {
    const body = await requestJson({
      url: 'https://notes-api.biji.com/account/v2/web/user/auth/refresh',
      method: 'POST',
      token: auth.token,
      deviceId: auth.device_id,
      body: { refresh_token: auth.refresh_token },
      label: 'Refresh token',
      retries,
      timeoutMs,
    });
    return refreshedToken(body) || auth.token;
  } catch (error) {
    process.stderr.write(`Warning: ${error.message}; trying the current access token.\n`);
    return auth.token;
  }
}

async function resolveTopicId(topicAlias, token, deviceId, retries, timeoutMs) {
  const query = new URLSearchParams({
    topic_id: '-1',
    topic_id_alias: topicAlias,
    sort: 'create_time_desc',
    resource_type: '0',
    page: '1',
  });
  const body = await requestJson({
    url: `https://knowledge-api.trytalks.com/v1/web/topic/resource/list/mix?${query}`,
    token,
    deviceId,
    label: 'Resolve topic',
    retries,
    timeoutMs,
  });
  const value = body?.c?.current_directory?.topic_id
    ?? body?.c?.current_directory?.topicId
    ?? body?.c?.topic_id
    ?? body?.c?.topic?.topic_id;
  const topicId = Number(value);
  if (!Number.isSafeInteger(topicId) || topicId <= 0) {
    throw new Error('Resolve topic: response did not contain a valid topic_id');
  }
  const returnedAlias = firstString(
    body?.c?.current_directory?.topic_id_alias,
    body?.c?.current_directory?.topic_alias,
    body?.c?.topic_id_alias,
  );
  if (returnedAlias && returnedAlias !== topicAlias) {
    throw new Error(`Resolve topic: returned alias ${returnedAlias} does not match ${topicAlias}`);
  }
  return topicId;
}

async function listPosts({ topicId, followId, token, deviceId, pageSize, retries, timeoutMs }) {
  const posts = [];
  let apiTotal = null;
  let terminated = false;
  for (let pageNumber = 1; pageNumber <= 10000; pageNumber += 1) {
    const body = await requestJson({
      url: 'https://knowledge-api.trytalks.com/v1/web/follow/account/posts',
      method: 'POST',
      token,
      deviceId,
      body: { topic_id: topicId, follow_id: followId, page: pageNumber, page_size: pageSize },
      label: `List page ${pageNumber}`,
      retries,
      timeoutMs,
    });
    const pagePosts = body?.c?.posts;
    if (!Array.isArray(pagePosts)) throw new Error(`List page ${pageNumber}: response did not contain c.posts`);
    const totalCandidate = firstNumber(body?.c?.total, body?.c?.count, body?.c?.post_count);
    if (totalCandidate) apiTotal = totalCandidate;
    posts.push(...pagePosts);
    process.stderr.write(`List: ${posts.length}${apiTotal ? `/${apiTotal}` : ''}\n`);
    if (pagePosts.length === 0 || pagePosts.length < pageSize || (apiTotal !== null && posts.length >= apiTotal)) {
      terminated = true;
      break;
    }
  }
  if (!terminated) throw new Error('Pagination exceeded the 10000-page safety limit');
  if (posts.length === 0) throw new Error('List returned zero posts');
  return { posts, apiTotal };
}

async function fetchDetails({ posts, topicAlias, token, deviceId, concurrency, retries, timeoutMs }) {
  const details = new Array(posts.length);
  const batchController = new AbortController();
  let cursor = 0;
  let completed = 0;
  let stopped = false;
  let fatalError = null;
  function stop(error) {
    if (!fatalError) fatalError = error;
    stopped = true;
    batchController.abort();
  }
  async function worker() {
    while (!stopped) {
      const index = cursor;
      cursor += 1;
      if (index >= posts.length) return;
      try {
        const postId = postIdOf(posts[index]);
        if (!postId) throw new Error(`Post at list index ${index} has no ID`);
        const body = await requestJson({
          url: 'https://knowledge-api.trytalks.com/v1/web/topic/post/detail',
          method: 'POST',
          token,
          deviceId,
          body: {
            topic_id: -1,
            topic_id_alias: topicAlias,
            post_id: postId,
            load_media_text: true,
          },
          label: `Detail ${postId}`,
          retries,
          timeoutMs,
          signal: batchController.signal,
        });
        const detail = body?.c?.post || body?.c;
        if (!detail || typeof detail !== 'object') {
          throw new Error(`Detail ${postId}: response did not contain a detail object`);
        }
        const returnedPostId = postIdOf(detail);
        if (!returnedPostId) throw new Error(`Detail ${postId}: response did not identify the returned post`);
        if (returnedPostId !== postId) {
          throw new Error(`Detail ${postId}: response identity mismatch (${returnedPostId})`);
        }
        details[index] = detail;
        completed += 1;
        if (completed % 20 === 0 || completed === posts.length) {
          process.stderr.write(`Details: ${completed}/${posts.length}\n`);
        }
      } catch (error) {
        stop(error);
        return;
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  if (fatalError) throw fatalError;
  if (details.filter(Boolean).length !== posts.length) {
    throw new Error('Detail batch ended before every post was filled');
  }
  return details;
}

function buildExport({ source, topicId, apiTotal, posts, details, expected }) {
  const seen = new Set();
  const notes = posts.map((post, index) => {
    const detail = details[index] || {};
    const postId = postIdOf(post);
    if (!postId) throw new Error(`Post at list index ${index} has no ID`);
    const detailPostId = postIdOf(detail);
    if (!detailPostId) throw new Error(`Detail at list index ${index} has no post ID`);
    if (detailPostId !== postId) throw new Error(`Detail identity mismatch: requested ${postId}, received ${detailPostId}`);
    if (seen.has(postId)) throw new Error(`Duplicate post ID detected: ${postId}`);
    seen.add(postId);
    const timestamp = firstNumber(
      detail.post_update_time,
      post.post_update_time,
      detail.post_publish_time,
      post.post_publish_time,
      detail.post_create_time,
      post.post_create_time,
    );
    return {
      index: index + 1,
      postId,
      title: firstString(detail.post_name, post.post_name, detail.post_title, post.post_title),
      date: formatTimestamp(timestamp),
      createdAt: firstNumber(detail.post_create_time, post.post_create_time),
      updatedAt: firstNumber(detail.post_update_time, post.post_update_time),
      originalText: firstString(
        detail.post_media_text,
        post.post_media_text,
        detail.post_content,
        detail.post_text,
        detail.content,
      ),
      aiSummary: firstString(
        detail.post_cleaned_summary,
        detail.post_summary,
        post.post_cleaned_summary,
        post.post_summary,
      ),
      sourceUrl: firstString(detail.post_url, post.post_url),
      noteUrl: `https://www.biji.com/post/${encodeURIComponent(source.topicAlias)}/${encodeURIComponent(postId)}/web`,
    };
  });
  const stats = {
    count: notes.length,
    uniqueIds: seen.size,
    expectedCount: expected ?? null,
    apiTotal: apiTotal ?? null,
    emptyTitle: notes.filter((note) => !note.title).length,
    emptyOriginal: notes.filter((note) => !note.originalText).length,
    emptySummary: notes.filter((note) => !note.aiSummary).length,
    originalChars: notes.reduce((total, note) => total + note.originalText.length, 0),
    summaryChars: notes.reduce((total, note) => total + note.aiSummary.length, 0),
    firstPostId: notes[0]?.postId || null,
    lastPostId: notes.at(-1)?.postId || null,
  };
  return {
    schemaVersion: 1,
    source: {
      subjectUrl: source.subjectUrl,
      topicAlias: source.topicAlias,
      topicId,
      followId: source.followId,
      extractedAt: new Date().toISOString(),
    },
    stats,
    notes,
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(HELP.trimStart());
    return;
  }
  validateOptions(options);
  const source = parseSubjectUrl(options.url);
  const outputPath = preflightOutput(options.out, options.force);
  let auth = {
    token: process.env.BIJI_TOKEN || '',
    refresh_token: process.env.BIJI_REFRESH_TOKEN || '',
    device_id: process.env.BIJI_DEVICE_ID || '',
  };
  if (options.leveldb) {
    const fromDb = await readAuthFromLevelDb(options.leveldb);
    auth = {
      token: auth.token || fromDb.token || '',
      refresh_token: auth.refresh_token || fromDb.refresh_token || '',
      device_id: auth.device_id || fromDb.device_id || '',
    };
  }
  if (!auth.token) throw new Error('No biji.com login token found in the supplied session data');

  const token = await refreshAccessToken(auth, options.retries, options.timeoutMs);
  const topicId = await resolveTopicId(source.topicAlias, token, auth.device_id, options.retries, options.timeoutMs);
  const { posts, apiTotal } = await listPosts({
    topicId,
    followId: source.followId,
    token,
    deviceId: auth.device_id,
    pageSize: options.pageSize,
    retries: options.retries,
    timeoutMs: options.timeoutMs,
  });
  const ids = posts.map(postIdOf);
  const uniqueIds = new Set(ids);
  if (ids.some((id) => !id)) throw new Error('The list contains a post without an ID');
  if (uniqueIds.size !== posts.length) {
    throw new Error(`The paginated list contains duplicate IDs (${uniqueIds.size} unique of ${posts.length}); rerun to avoid page drift`);
  }
  if (options.expected !== undefined && posts.length !== options.expected) {
    throw new Error(`Expected ${options.expected} posts but the API returned ${posts.length}`);
  }
  if (apiTotal !== null && posts.length !== apiTotal) {
    throw new Error(`API total is ${apiTotal} but pagination returned ${posts.length}`);
  }

  const details = await fetchDetails({
    posts,
    topicAlias: source.topicAlias,
    token,
    deviceId: auth.device_id,
    concurrency: options.concurrency,
    retries: options.retries,
    timeoutMs: options.timeoutMs,
  });
  const exported = buildExport({ source, topicId, apiTotal, posts, details, expected: options.expected });
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  if (fs.existsSync(outputPath) && !options.force) {
    throw new Error(`Output already exists; choose a new path or pass --force: ${outputPath}`);
  }
  const temporaryOutput = `${outputPath}.${process.pid}.${crypto.randomUUID()}.tmp`;
  fs.writeFileSync(temporaryOutput, `${JSON.stringify(exported, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
  try {
    fs.renameSync(temporaryOutput, outputPath);
  } finally {
    if (fs.existsSync(temporaryOutput)) fs.rmSync(temporaryOutput);
  }
  process.stdout.write(`${JSON.stringify(exported.stats, null, 2)}\n`);

  const strictFailure = exported.stats.emptyTitle || exported.stats.emptyOriginal || exported.stats.emptySummary;
  if (options.strict && strictFailure) {
    process.stderr.write(`Strict validation failed; inspect ${outputPath}\n`);
    process.exitCode = 2;
  }
}

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`Error: ${error.message}\n`);
    process.exitCode = 1;
  });
}

module.exports = {
  buildExport,
  decodeLocalStorageValue,
  fetchDetails,
  formatTimestamp,
  parseArgs,
  parseSubjectUrl,
  postIdOf,
  preflightOutput,
  requestJson,
};
