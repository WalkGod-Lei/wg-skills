---
name: github-tuisong
description: Push local skill files to a GitHub repository via gh api. Covers the complete sync workflow - list local/remote files, diff comparison, SHA retrieval, base64 payload construction, file push (new or update), README download-edit-push, one-click install command generation, 409 conflict handling, and integrity verification. Use when the user asks to push/sync skills to GitHub, update a skill repo, or mentions GitHub推送/同步skill/推送技能到GitHub/gh api push.
version: 1.0.0
---

# GitHub Skill 推送

将本地 skill 文件同步推送到 GitHub 仓库的完整工作流。

## 前置条件

- gh CLI 已安装并认证（Windows 路径: `C:\Program Files\GitHub CLI\gh.exe`）
- 知道目标仓库（owner/repo）和 skill 在仓库中的目录路径
- 仓库已存在（如需新建，用 `gh repo create`）

## 仓库命名惯例

- `bystander` = 局外先生 (juwai-xiansheng) IP 系列技能仓库
- `la-group` = 懒懒团 (LLT) IP 系列技能仓库
- 工具类技能（如本技能）使用独立仓库，仓库名 = skill 名

## 工作流

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

- **新增**: 本地有、远程无 → 直接 PUT 推送（不需要 SHA）
- **更新**: 本地有、远程有 → 需要先获取远程 SHA 再 PUT
- **无变化**: 本地有、远程有且大小一致 → 可跳过（但建议推送以确保一致）

### Step 4: 获取远程文件 SHA（仅对需更新的文件）

    "C:\Program Files\GitHub CLI\gh.exe" api repos/OWNER/REPO/contents/SKILL_DIR/SKILL.md --jq '.sha'
    "C:\Program Files\GitHub CLI\gh.exe" api repos/OWNER/REPO/contents/README.md --jq '.sha'

### Step 5: 构建 base64 payload

用 Node.js 读取文件、base64 编码、构建 JSON payload 写入临时文件:

    node -e "const fs=require('fs');const content=fs.readFileSync('LOCAL_FILE_PATH');const base64=content.toString('base64');const payload={message:'COMMIT_MESSAGE',content:base64,sha:'REMOTE_SHA',branch:'main'};fs.writeFileSync('PAYLOAD_PATH',JSON.stringify(payload));console.log('Payload written, size:',JSON.stringify(payload).length)"

注意: 新增文件不需要 `sha` 字段；更新文件必须包含 `sha`。

### Step 6: 推送到 GitHub

    "C:\Program Files\GitHub CLI\gh.exe" api -X PUT repos/OWNER/REPO/contents/FILE_PATH --input PAYLOAD_PATH --jq '.commit.sha'

成功返回 commit SHA。如果返回 409，说明文件已成功推送（见下方「409 冲突」）。

### Step 7: README 下载-编辑-推送

README 通常需要更新版本号、功能说明、安装命令等。分步执行:

**7a. 下载远程 README 到本地:**

    "C:\Program Files\GitHub CLI\gh.exe" api repos/OWNER/REPO/contents/README.md -H "Accept: application/vnd.github.raw+json" > WORKSPACE/README.md

**7b. 用 Edit 工具修改本地 README:**

- 更新版本号
- 更新功能说明
- 添加/更新一键安装命令

**7c. 构建 payload 并推送:**

    node -e "const fs=require('fs');const content=fs.readFileSync('WORKSPACE/README.md');const payload={message:'README update',content:content.toString('base64'),sha:'README_SHA',branch:'main'};fs.writeFileSync('WORKSPACE/readme_payload.json',JSON.stringify(payload))"

    "C:\Program Files\GitHub CLI\gh.exe" api -X PUT repos/OWNER/REPO/contents/README.md --input WORKSPACE/readme_payload.json --jq '.commit.sha'

### Step 8: 生成一键安装命令

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

### Step 9: 验证完整性

推送后验证所有文件:

    # 验证文件内容标记
    "C:\Program Files\GitHub CLI\gh.exe" api repos/OWNER/REPO/contents/SKILL_DIR/SKILL.md -H "Accept: application/vnd.github.raw+json" | node -e "process.stdin.resume();let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const lines=d.split('\n');console.log('Total lines:',lines.length)})"

    # 验证文件大小
    "C:\Program Files\GitHub CLI\gh.exe" api repos/OWNER/REPO/contents/SKILL_DIR/references/FILE --jq '.size'

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

### Grep / findstr 不可用

**问题**: Windows 上 ripgrep 可能 ENOENT，findstr 有编码问题。

**替代方案**: 用 Node.js 做文件内容验证:

    node -e "const fs=require('fs');const c=fs.readFileSync('FILE_PATH','utf8');const lines=c.split('\n');console.log('Total lines:',lines.length);console.log('Line N:',lines[N-1])"

### gh CLI 网络超时

gh CLI 的设备认证流程可能超时。如已认证，直接用 `gh api` 即可。如需重新认证，可能需要手动在浏览器完成 device flow。

## 命令速查

- 列出远程目录: `gh api repos/O/R/contents/P --jq '.[].name'`
- 获取文件 SHA: `gh api repos/O/R/contents/P/F --jq '.sha'`
- 下载文件内容: `gh api repos/O/R/contents/P/F -H "Accept: application/vnd.github.raw+json"`
- 推送/更新文件: `gh api -X PUT repos/O/R/contents/P/F --input payload.json --jq '.commit.sha'`
- 新建仓库: `gh repo create NAME --public --description DESC`

**payload JSON 结构:**

    {
      "message": "commit message",
      "content": "base64 encoded content",
      "sha": "existing file SHA (updates only)",
      "branch": "main"
    }
