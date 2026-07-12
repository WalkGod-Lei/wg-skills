---
name: wg-github-renew-locate
description: Pull and update skills from GitHub repositories to local. Syncs remote skill files to ~/.qoderworkcn/skills/. Covers - list remote skill directories, compare with local, download files (SKILL.md + references + agents), place in local skill directory, verify integrity. Use when the user asks to pull/sync/update skills from GitHub, refresh local skills, or mentions GitHub拉取/同步技能/更新本地skill/gh api pull/从GitHub安装.
version: 1.0.0
---

# GitHub Skill 拉取更新

从 GitHub 仓库拉取 skill 文件并更新到本地 `~/.qoderworkcn/skills/` 目录。

## 前置条件

- gh CLI 已安装并认证（Windows 路径: `C:\Program Files\GitHub CLI\gh.exe`）
- 知道目标仓库（owner/repo）和 skill 目录路径

## 仓库命名惯例

| 仓库 | 含义 | 用途 |
|------|------|------|
| bystander | 局外先生 (juwai-xiansheng) | 局外先生 IP 系列技能 |
| la-group | 懒懒团 (LLT) | 懒懒团 IP 系列技能 |
| wg-1107 | 个人仓库 | 个人技能（当前：随笔 wg-suibi-write） |
| wg-skills | 工具类 | wg-github-tuisong + wg-github-renew-locate + wg-biji-note-extractor |

## 仓库内 skill 目录结构

- bystander: skill 直接在根目录子文件夹（如 `jx-copy/`）
- la-group: 待确认
- wg-1107: skill 在 `skills/` 子目录下（如 `skills/wg-suibi-write/`）
- wg-skills: skill 在根目录子文件夹（如 `wg-github-tuisong/`）

## 工作流

### Step 1: 列出远程 skill 文件

    "C:\Program Files\GitHub CLI\gh.exe" api repos/OWNER/REPO/contents/SKILL_DIR --jq '.[].name'
    "C:\Program Files\GitHub CLI\gh.exe" api repos/OWNER/REPO/contents/SKILL_DIR/references --jq '.[].name'
    "C:\Program Files\GitHub CLI\gh.exe" api repos/OWNER/REPO/contents/SKILL_DIR/agents --jq '.[].name'

### Step 2: 列出本地已有文件

    node -e "const fs=require('fs'),path=require('path');function walk(dir,base=''){const items=fs.readdirSync(dir,{withFileTypes:true});let files=[];for(const item of items){const rel=base?base+'/'+item.name:item.name;const full=path.join(dir,item.name);if(item.isDirectory()){files.push({path:rel,type:'dir'});files=files.concat(walk(full,rel))}else{files.push({path:rel,type:'file',size:fs.statSync(full).size})}}return files}console.log(JSON.stringify(walk('LOCAL_SKILL_DIR'),null,2))"

若本地 skill 目录不存在，所有文件按「新增」处理。

### Step 3: 对比差异

将远程文件列表与本地对比：
- **新增**: 远程有、本地无 → 下载
- **更新**: 远程有、本地有 → 比较大小，不一致则下载覆盖
- **无变化**: 大小一致 → 可跳过

### Step 4: 下载文件

对每个需要更新的文件，用 gh api 下载原始内容：

    # 下载单个文件
    "C:\Program Files\GitHub CLI\gh.exe" api repos/OWNER/REPO/contents/SKILL_DIR/SKILL.md -H "Accept: application/vnd.github.raw+json" > LOCAL_SKILL_DIR/SKILL.md

对子目录文件同样处理：

    mkdir -p LOCAL_SKILL_DIR/references
    "C:\Program Files\GitHub CLI\gh.exe" api repos/OWNER/REPO/contents/SKILL_DIR/references/FILE -H "Accept: application/vnd.github.raw+json" > LOCAL_SKILL_DIR/references/FILE

### Step 5: 验证完整性

    node -e "const fs=require('fs');const c=fs.readFileSync('LOCAL_SKILL_DIR/SKILL.md','utf8');const lines=c.split('\n');console.log('Total lines:',lines.length);console.log('Line 1:',lines[0]);console.log('Line 2:',lines[1])"

确认：
- 本地文件大小与远程一致（可通过 `gh api ... --jq '.size'` 获取远程大小）
- 内容关键标记（版本号、name 字段）正确

### Step 6: 批量拉取

如需从多个仓库拉取多个 skill，按仓库分组依次执行：

    示例：从 bystander 拉取 jx-copy
    1. 列远程：gh api repos/WalkGod-Lei/bystander/contents/jx-copy
    2. 下载到本地：~/.qoderworkcn/skills/jx-copy/

    示例：从 wg-1107 拉取 wg-suibi-write
    1. 列远程：gh api repos/WalkGod-Lei/wg-1107/contents/skills/wg-suibi-write
    2. 下载到本地：~/.qoderworkcn/skills/wg-suibi-write/

    示例：从 wg-skills 拉取 wg-github-tuisong
    1. 列远程：gh api repos/WalkGod-Lei/wg-skills/contents/wg-github-tuisong
    2. 下载到本地：~/.qoderworkcn/skills/wg-github-tuisong/

## 常见问题

### execSync 路径转义失败

同 github-tuisong skill，放弃 execSync，改用分步 Bash + Node.js。

### 远程目录不存在

如果 skill 目录在远程不存在（404），说明该仓库中尚未配置此 skill。确认仓库名和路径是否正确。

### 下载后文件为空

确认使用了 `-H "Accept: application/vnd.github.raw+json"` header，否则返回的是 JSON（含 base64 编码内容），而非原始文件。

## 命令速查

- 列出远程目录: `gh api repos/O/R/contents/P --jq '.[].name'`
- 下载文件内容: `gh api repos/O/R/contents/P/F -H "Accept: application/vnd.github.raw+json"`
- 获取文件大小: `gh api repos/O/R/contents/P/F --jq '.size'`
- 本地验证: `node -e "const fs=require('fs');console.log(fs.readFileSync('PATH','utf8').split('\n').length)"`
