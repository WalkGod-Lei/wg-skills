---
name: wg-github-tuisong
description: Push local skill files to a GitHub repository. Supports two methods — gh api (single-file, fine-grained control) and GitHub MCP mcp__github__push_files (multi-file atomic commit). Covers complete workflows — list local/remote files, diff comparison, SHA retrieval, base64 payload construction, file push (new or update), file migration (push new location + DELETE old location), README download-edit-push, one-click install command generation, 409 conflict handling, and integrity verification. Also includes per-repo configuration guide (directory structure, README rules, public/private) and skill update maintenance conventions. Use when the user asks to push/sync skills to GitHub, update a skill repo, migrate files between directories, or mentions GitHub推送/同步skill/推送技能到GitHub/gh api push/文件迁移/push_files.
version: 1.2.0
---

# GitHub Skill 推送

将本地 skill 文件同步推送到 GitHub 仓库的完整工作流。支持两种推送方法和文件迁移场景。

## 前置条件

- gh CLI 已安装并认证（Windows 路径: `C:\Program Files\GitHub CLI\gh.exe`）
- 知道目标仓库（owner/repo）和 skill 在仓库中的目录路径
- 仓库已存在（如需新建，用 `gh repo create`）
- GitHub MCP 可用（`mcp__github__push_files` 等工具已连接）

## 方法选择

根据场景选择推送方法：

| 场景 | 推荐方法 | 理由 |
|------|----------|------|
| 推送 1-2 个文件，需要精细控制 | 方法 A: gh api | 可单独控制 SHA、message、删除 |
| 多文件同时推送（SKILL.md + README + references） | 方法 B: GitHub MCP push_files | 一次原子 commit，无需手动 base64 |
| 文件迁移（新位置 + 删除旧位置） | 方法 B 推送 + gh api DELETE | MCP push_files 不支持 DELETE，需 gh api 补充 |
| 只需删除远程文件 | gh api DELETE | MCP 不支持删除操作 |

**核心原则**: 推送用 MCP push_files（高效），删除用 gh api DELETE（唯一选项）。两者可混合使用。

## 仓库命名惯例

| 仓库 | 含义 | 用途 |
|------|------|------|
| bystander | 局外先生 (juwai-xiansheng) | 局外先生 IP 系列技能（jx-genesis/jx-hardtalk/jx-copy/jx-insight/jx-mirror/jx-mirror-free/jx-router） |
| LazyGroup | 懒懒团 (LLT/LazyGroup) | 懒懒团 IP 系列技能（llt-comic-creator） |
| WalkGod | 走神的个人知识与 Skill 仓库 | 个人技能（当前：随笔 wg-suibi-write） |
| wg-skills | 工具类 | wg-github-tuisong + wg-github-renew-locate + wg-biji-note-extractor + wg-cognitive-reconstruction + wg-insight-engine |

---

## 仓库配置指南

每个仓库有不同的目录结构、README 规则和访问属性。推送前必须确认以下配置。

### bystander（局外先生 IP）

- **可见性**: 私有仓库
- **Owner/Repo**: `WalkGod-Lei/bystander`
- **目录结构**: 技能直接放在仓库根目录，无外层 `skills/` 包裹

        bystander/
        ├── README.md
        ├── jx-copy/SKILL.md, references/, agents/
        ├── jx-genesis/SKILL.md, references/
        ├── jx-hardtalk/SKILL.md, references/
        ├── jx-insight/SKILL.md, references/
        ├── jx-mirror/SKILL.md, references/
        ├── jx-mirror-free/SKILL.md, references/
        └── jx-router/SKILL.md, references/, agents/

- **README 规则**: 中文，面向内部使用；README 中列出所有 jx 系列技能及简介
- **安装命令 strip-components**: `--strip-components=1`（技能在根目录下）
- **推送路径示例**: `jx-copy/SKILL.md`、`jx-genesis/references/metaphor-engine.md`
- **特殊说明**: 局外先生系列技能只推送至 bystander，不得单独建公开仓库

### LazyGroup（懒懒团 IP）

- **可见性**: 私有仓库
- **Owner/Repo**: `WalkGod-Lei/LazyGroup`
- **目录结构**: 技能直接放在仓库根目录

        LazyGroup/
        ├── README.md
        └── llt-comic-creator/
            ├── SKILL.md
            ├── agents/openai.yaml
            ├── assets/visual-reference/*.png
            └── references/

- **README 规则**: 中文，面向内部使用
- **安装命令 strip-components**: `--strip-components=1`
- **推送路径示例**: `llt-comic-creator/SKILL.md`
- **特殊说明**: assets 目录含 PNG 图片（约 13MB），推送时走方法 B（MCP push_files），图片文件需 base64 编码

### WalkGod（个人知识与 Skill 仓库）

- **可见性**: 私有仓库
- **Owner/Repo**: `WalkGod-Lei/WalkGod`
- **目录结构**: 技能放在 `skills/` 子目录下

        WalkGod/
        ├── README.md
        └── skills/
            └── wg-suibi-write/
                ├── SKILL.md
                ├── agents/openai.yaml
                └── references/

- **README 规则**: 中文，面向内部使用；详细说明每个收录技能的用途和使用方式
- **安装命令 strip-components**: `--strip-components=2`（多一层 `skills/` 目录）
- **推送路径示例**: `skills/wg-suibi-write/SKILL.md`
- **特殊说明**: 新增个人技能统一放到 `skills/` 子目录下，使用 `wg-` 前缀

### wg-skills（工具类，公开）

- **可见性**: 公开仓库
- **Owner/Repo**: `WalkGod-Lei/wg-skills`
- **目录结构**: 技能直接放在仓库根目录

        wg-skills/
        ├── README.md
        ├── wg-github-tuisong/SKILL.md
        ├── wg-github-renew-locate/SKILL.md
        ├── wg-biji-note-extractor/SKILL.md, scripts/, references/, install.ps1, install.sh
        ├── wg-cognitive-reconstruction/SKILL.md
        └── wg-insight-engine/SKILL.md, references/, evals/

- **README 规则**: 全英文，面向国际受众；表格列出所有技能名称、目录、描述和版本
- **安装命令 strip-components**: `--strip-components=1`
- **推送路径示例**: `wg-github-tuisong/SKILL.md`、`README.md`
- **特殊说明**: 公开仓库，推送后务必检查 README 不暴露私有仓库名称（如 bystander、LazyGroup）；不得在 README 或描述中引用私有仓库

### 配置速查表

| 仓库 | 可见性 | 技能路径 | strip | README 语言 | 注意事项 |
|------|--------|----------|-------|-------------|----------|
| bystander | 私有 | `SKILL_NAME/` | 1 | 中文 | 局外先生专属，不外泄 |
| LazyGroup | 私有 | `SKILL_NAME/` | 1 | 中文 | assets 含大图片 |
| WalkGod | 私有 | `skills/SKILL_NAME/` | 2 | 中文 | wg- 前缀 |
| wg-skills | 公开 | `SKILL_NAME/` | 1 | 全英文 | 不暴露私有仓库名 |

---

## 更新维护规范

技能推送完成后，必须同步更新相关文档和配置。以下流程适用于所有仓库。

### 推送新技能后的检查清单

1. **仓库命名惯例表**: 确认本技能的 SKILL.md 中「仓库命名惯例」表已包含目标仓库的最新名称和用途列表
2. **目标仓库 README**: 在 README 的技能列表中添加新技能（名称、目录、描述、版本号）
3. **安装命令**: 在 README 中添加新技能的一键安装命令（如有安装脚本也需推送）
4. **仓库配置指南**: 确认本技能的「仓库配置指南」中对应仓库的目录结构已反映新技能
5. **验证完整性**: 推送后用 `gh api .../git/trees/main?recursive=1` 验证远程文件树

### 更新已有技能后的检查清单

1. **版本号**: SKILL.md frontmatter 中的 `version` 字段递增（语义化版本）
2. **README 同步**: 目标仓库 README 中对应技能的版本号同步更新
3. **变更说明**: commit message 描述变更内容（如 "Update wg-xxx to v2.0: add cognitive toolkit"）
4. **多文件一致性**: 如果同时更新了 SKILL.md + references/ 下文件，用方法 B 一次性推送保证原子性
5. **本地同步**: 推送后建议用 wg-github-renew-locate 拉取远程版本覆盖本地，确保本地和远程一致

### 仓库改名后的更新流程

当远程仓库重命名（如 `wg-1107` → `WalkGod`、`la-group` → `LazyGroup`）时:

1. **更新命名惯例表**: 修改本技能 SKILL.md 中的仓库名和含义
2. **更新仓库配置指南**: 修改对应仓库的 Owner/Repo 路径、目录结构等
3. **更新安装命令**: 所有 README 和安装脚本中的 `github.com/OWNER/REPO` URL 同步修改
4. **全量搜索替换**: 在本技能 SKILL.md 中搜索旧仓库名，确认无遗漏
5. **推送本技能**: 修改完成后用本技能自身的工作流推送到 wg-skills 仓库

### README 红线（公开仓库 wg-skills）

- README 必须全英文，不混中文
- 不得暴露私有仓库名称（bystander、LazyGroup 等），用通用描述替代
- 内部交叉引用（如本 SKILL.md 中的仓库惯例表）不受此限制，因为只由 agent 读取

### 跨仓库更新顺序

当一次操作涉及多个仓库时，按以下顺序执行:

1. 先推送 IP/个人仓库的技能文件（bystander → LazyGroup → WalkGod）
2. 再推送 wg-skills 仓库（如有工具类技能更新）
3. 最后推送本技能（wg-github-tuisong）的更新到 wg-skills（确保命名惯例表是最新的）

---

## 公共步骤（方法 A 和 B 共用）

### Step 1: 列出本地文件

用 Node.js 递归列出 skill 目录所有文件（路径+大小）:

    const fs = require('fs'), path = require('path');
    function walk(dir, base = '') {
      const items = fs.readdirSync(dir, {withFileTypes: true});
      let files = [];
      for (const item of items) {
        const rel = base ? base + '/' + item.name : item.name;
        const full = path.join(dir, item.name);
        if (item.isDirectory()) {
          files.push({path: rel, type: 'dir'});
          files = files.concat(walk(full, rel));
        } else {
          files.push({path: rel, type: 'file', size: fs.statSync(full).size});
        }
      }
      return files;
    }
    const result = walk('LOCAL_SKILL_DIR');
    console.log(JSON.stringify(result, null, 2));

### Step 2: 检查远程仓库

列出 GitHub 仓库中对应目录的已有文件（含子目录递归）:

    "C:\Program Files\GitHub CLI\gh.exe" api repos/OWNER/REPO/contents/SKILL_DIR --jq '.[].name'
    "C:\Program Files\GitHub CLI\gh.exe" api repos/OWNER/REPO/contents/SKILL_DIR/references --jq '.[].name'
    "C:\Program Files\GitHub CLI\gh.exe" api repos/OWNER/REPO/contents/SKILL_DIR/agents --jq '.[].name'

若仓库为空或目录不存在，所有文件按「新增」处理。

### Step 3: 对比差异

将本地文件列表与远程对比，分为三类:

- **新增**: 本地有、远程无 → 直接推送（不需要 SHA）
- **更新**: 本地有、远程有 → 需要先获取远程 SHA 再推送
- **无变化**: 本地有、远程有且大小一致 → 可跳过（但建议推送以确保一致）

---

## 方法 A: gh api 单文件推送

适用于 1-2 个文件的精细推送，或需要单独控制每次提交的场景。

### Step A1: 获取远程文件 SHA（仅对需更新的文件）

    "C:\Program Files\GitHub CLI\gh.exe" api repos/OWNER/REPO/contents/SKILL_DIR/SKILL.md --jq '.sha'
    "C:\Program Files\GitHub CLI\gh.exe" api repos/OWNER/REPO/contents/README.md --jq '.sha'

### Step A2: 构建 base64 payload

用 Node.js 读取文件、base64 编码、构建 JSON payload 写入临时文件:

    node -e "const fs=require('fs');const content=fs.readFileSync('LOCAL_FILE_PATH');const base64=content.toString('base64');const payload={message:'COMMIT_MESSAGE',content:base64,sha:'REMOTE_SHA',branch:'main'};fs.writeFileSync('PAYLOAD_PATH',JSON.stringify(payload));console.log('Payload written, size:',JSON.stringify(payload).length)"

注意: 新增文件不需要 `sha` 字段；更新文件必须包含 `sha`。

### Step A3: 推送到 GitHub

    "C:\Program Files\GitHub CLI\gh.exe" api -X PUT repos/OWNER/REPO/contents/FILE_PATH --input PAYLOAD_PATH --jq '.commit.sha'

成功返回 commit SHA。如果返回 409，说明文件已成功推送（见下方「409 冲突」）。

---

## 方法 B: GitHub MCP 多文件原子推送

适用于多文件同时推送，一次 commit 完成所有变更。无需手动 base64 编码和构建 payload。

### Step B1: 准备文件内容

用 Read 工具或 Node.js 读取所有需要推送的文件内容（纯文本直接传，二进制需 base64）。

### Step B2: 调用 mcp__github__push_files

通过 `qw_mcp_call` 调用 GitHub MCP 的 `push_files` 工具:

    qw_mcp_call({
      toolName: "mcp__github__push_files",
      arguments: {
        owner: "OWNER",
        repo: "REPO",
        branch: "main",
        message: "commit message describing all changes",
        files: [
          {
            path: "SKILL_DIR/SKILL.md",
            content: "... (file content as string) ..."
          },
          {
            path: "README.md",
            content: "... (updated README) ..."
          },
          {
            path: "SKILL_DIR/references/example.md",
            content: "... (reference file) ..."
          }
        ]
      }
    })

**关键参数说明:**

| 参数 | 必填 | 说明 |
|------|------|------|
| owner | 是 | 仓库所有者 |
| repo | 是 | 仓库名 |
| branch | 是 | 目标分支（通常 `main`） |
| message | 是 | commit message |
| files | 是 | 文件数组，每项含 path 和 content |
| files[].path | 是 | 仓库中的完整路径（不含前导 /） |
| files[].content | 是 | 文件内容（纯文本字符串） |
| files[].sha | 否 | 更新已有文件时，某些 MCP 实现需要 SHA |

**优势:**
- 多文件在一次 commit 中完成，git 历史更干净
- 无需手动 base64 编码（MCP 工具自动处理）
- 无需逐个获取远程 SHA（新增和更新统一处理）
- 新增文件时不需要特殊标记

**注意:**
- MCP push_files 不支持删除文件，删除必须用 gh api DELETE（见「文件删除」）
- 如果 MCP 连接不可用，回退到方法 A

### Step B3: 验证推送结果

push_files 返回成功的 commit 信息后，用公共验证步骤确认:

    "C:\Program Files\GitHub CLI\gh.exe" api "repos/OWNER/REPO/git/trees/main?recursive=1" --jq ".tree[].path"

---

## 文件删除

MCP push_files 不支持删除操作。删除远程文件必须使用 gh api DELETE:

### 获取待删除文件的 SHA

    "C:\Program Files\GitHub CLI\gh.exe" api repos/OWNER/REPO/contents/FILE_PATH --jq ".sha"

### 执行删除

    "C:\Program Files\GitHub CLI\gh.exe" api -X DELETE repos/OWNER/REPO/contents/FILE_PATH -f message="Remove FILE_PATH" -f sha=FILE_SHA

返回 commit 信息即表示删除成功。

**注意**: 如果前一步 push_files 产生了新 commit，删除前需要重新获取 SHA（旧 SHA 可能已过期）。

---

## 文件迁移（移动到新位置）

文件迁移 = 推送新位置 + 删除旧位置。这是一个常见场景（如把 skill 从子目录移到根目录）。

### 完整迁移流程

**1. 获取旧文件 SHA（用于后续删除）:**

    "C:\Program Files\GitHub CLI\gh.exe" api repos/OWNER/REPO/contents/OLD_PATH/SKILL.md --jq ".sha"

**2. 推送到新位置（推荐用方法 B 一次性推送所有文件 + README 更新）:**

    qw_mcp_call({
      toolName: "mcp__github__push_files",
      arguments: {
        owner: "OWNER",
        repo: "REPO",
        branch: "main",
        message: "Move SKILL_NAME from OLD_DIR/ to NEW_DIR/",
        files: [
          { path: "NEW_PATH/SKILL.md", content: "..." },
          { path: "README.md", content: "... (updated with new path) ..." }
        ]
      }
    })

**3. 删除旧位置（注意: push_files 产生新 commit 后，旧文件 SHA 不变，可直接用之前获取的 SHA）:**

    "C:\Program Files\GitHub CLI\gh.exe" api -X DELETE repos/OWNER/REPO/contents/OLD_PATH/SKILL.md -f message="Remove SKILL_NAME from OLD_PATH/ (moved to NEW_PATH/)" -f sha=OLD_FILE_SHA

**4. 验证最终结构:**

    "C:\Program Files\GitHub CLI\gh.exe" api "repos/OWNER/REPO/git/trees/main?recursive=1" --jq ".tree[].path"

确认新位置有文件、旧位置已清空。如果旧目录已空，GitHub 会自动清理空目录。

### 迁移检查清单

- [ ] 新位置文件内容完整
- [ ] README 中的路径已更新
- [ ] 旧位置文件已删除
- [ ] 远程仓库树结构符合预期

---

## README 更新流程

README 通常需要更新版本号、功能说明、安装命令等。两种方法:

### 方法 A 下的 README 流程

**a. 下载远程 README 到本地:**

    "C:\Program Files\GitHub CLI\gh.exe" api repos/OWNER/REPO/contents/README.md -H "Accept: application/vnd.github.raw+json" > WORKSPACE/README.md

**b. 用 Edit 工具修改本地 README:**

- 更新版本号
- 更新功能说明
- 添加/更新一键安装命令
- 如发生文件迁移，更新路径

**c. 构建 payload 并推送:**

    node -e "const fs=require('fs');const content=fs.readFileSync('WORKSPACE/README.md');const payload={message:'README update',content:content.toString('base64'),sha:'README_SHA',branch:'main'};fs.writeFileSync('WORKSPACE/readme_payload.json',JSON.stringify(payload))"

    "C:\Program Files\GitHub CLI\gh.exe" api -X PUT repos/OWNER/REPO/contents/README.md --input WORKSPACE/readme_payload.json --jq '.commit.sha'

### 方法 B 下的 README 流程

直接用 Read 工具获取远程 README 内容，用 Edit 修改后，作为 `push_files` 的 files 数组中的一项一起提交。不需要单独的 payload 和 SHA。

---

## 生成一键安装命令

推送完成后，在 README 中生成/更新安装命令。两种格式:

**QoderWork agent 对话中发送:**

    请从 https://github.com/OWNER/REPO 安装 SKILL_NAME skill。
    克隆仓库后，把 SKILL_DIR/ 目录复制到 ~/.qoderworkcn/skills/SKILL_NAME/，然后验证 SKILL.md 在。

**命令行一键安装（curl + tar，无需 git）:**

    mkdir -p ~/.qoderworkcn/skills/SKILL_NAME && \
    curl -sL https://github.com/OWNER/REPO/archive/refs/heads/main.tar.gz | \
    tar xz --strip-components=1 -C ~/.qoderworkcn/skills/SKILL_NAME

注意: 如果 skill 在仓库子目录中（如 bystander 仓库的 jx-copy/），strip-components 改为 2:

    mkdir -p ~/.qoderworkcn/skills/SKILL_NAME && \
    curl -sL https://github.com/OWNER/REPO/archive/refs/heads/main.tar.gz | \
    tar xz --strip-components=2 -C ~/.qoderworkcn/skills/SKILL_NAME REPO-main/SKILL_DIR

## 验证完整性

推送后验证所有文件:

    # 验证文件内容标记
    "C:\Program Files\GitHub CLI\gh.exe" api repos/OWNER/REPO/contents/SKILL_DIR/SKILL.md -H "Accept: application/vnd.github.raw+json" | node -e "process.stdin.resume();let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const lines=d.split('\n');console.log('Total lines:',lines.length)})"

    # 验证文件大小
    "C:\Program Files\GitHub CLI\gh.exe" api repos/OWNER/REPO/contents/SKILL_DIR/references/FILE --jq '.size'

    # 验证完整仓库树
    "C:\Program Files\GitHub CLI\gh.exe" api "repos/OWNER/REPO/git/trees/main?recursive=1" --jq ".tree[].path"

对比远程文件大小与本地是否一致，检查内容关键标记（版本号、章节标题等）。

## 常见问题与替代方案

### execSync 路径转义失败

**问题**: Windows 上 gh.exe 路径含反斜杠和空格（`C:\Program Files\GitHub CLI\gh.exe`），在 Node.js execSync 中调用时路径转义失败。

**替代方案**: 放弃 execSync，改用分步执行:
1. Bash 调 gh → 输出保存到本地文件或变量
2. Read/Edit 工具处理本地文件
3. Node.js 构建 payload（只用 fs，不调外部命令）
4. Bash 调 gh 推送 payload

### 409 冲突

**含义**: 文件已成功推送，当前 SHA 已过期。不是错误，是确认。

**处理**: 不需要重试。409 说明第一次 PUT 已成功，第二次用旧 SHA 才报冲突。验证远程文件内容即可确认。

### MCP push_files 与 gh api DELETE 的 SHA 时效

**问题**: push_files 产生新 commit 后，之前获取的 SHA 对于同一文件可能过期。

**处理**: 删除旧位置的文件时，旧文件的 SHA 通常不受新 commit 影响（因为新 commit 只改了其他文件）。但如果同时修改和删除同一文件，需要重新获取 SHA。安全做法：删除前先查一次 SHA。

### Grep / findstr 不可用

**问题**: Windows 上 ripgrep 可能 ENOENT，findstr 有编码问题。

**替代方案**: 用 Node.js 做文件内容验证:

    node -e "const fs=require('fs');const c=fs.readFileSync('FILE_PATH','utf8');const lines=c.split('\n');console.log('Total lines:',lines.length);console.log('Line N:',lines[N-1])"

### gh CLI 网络超时

gh CLI 的设备认证流程可能超时。如已认证，直接用 `gh api` 即可。如需重新认证，可能需要手动在浏览器完成 device flow。

## 命令速查

### gh api 命令

- 列出远程目录: `gh api repos/O/R/contents/P --jq '.[].name'`
- 获取文件 SHA: `gh api repos/O/R/contents/P/F --jq '.sha'`
- 下载文件内容: `gh api repos/O/R/contents/P/F -H "Accept: application/vnd.github.raw+json"`
- 推送/更新文件: `gh api -X PUT repos/O/R/contents/P/F --input payload.json --jq '.commit.sha'`
- 删除文件: `gh api -X DELETE repos/O/R/contents/P/F -f message="msg" -f sha=SHA`
- 查看完整仓库树: `gh api repos/O/R/git/trees/main?recursive=1 --jq ".tree[].path"`
- 新建仓库: `gh repo create NAME --public --description DESC`

### GitHub MCP 工具

- 多文件原子推送: `qw_mcp_call({ toolName: "mcp__github__push_files", arguments: { owner, repo, branch, message, files: [{path, content}] } })`
- 获取文件内容: `qw_mcp_call({ toolName: "mcp__github__get_file_contents", arguments: { owner, repo, path, branch } })`

### payload JSON 结构（方法 A）

    {
      "message": "commit message",
      "content": "base64 encoded content",
      "sha": "existing file SHA (updates only)",
      "branch": "main"
    }

### MCP push_files files 数组结构（方法 B）

    [
      { "path": "dir/file.md", "content": "raw file content string" },
      { "path": "README.md", "content": "updated readme content" }
    ]
