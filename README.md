# GitHub Skills 工具仓库

本仓库包含两个 QoderWork 技能，用于在本地与 GitHub 仓库之间同步 skill 文件。

## 技能列表

| 技能 | 目录 | 功能 | 版本 |
|------|------|------|------|
| **github-tuisong** | `github-tuisong/` | 本地 → GitHub：推送 skill 文件到远程仓库 | v1.0.0 |
| **github-renew-locate** | `github-renew-locate/` | GitHub → 本地：从远程仓库拉取 skill 到本地 | v1.0.0 |

## 仓库命名惯例

| 仓库 | 含义 | 用途 |
|------|------|------|
| `bystander` | 局外先生 (juwai-xiansheng) | 局外先生 IP 系列技能 |
| `la-group` | 懒懒团 (LLT) | 懒懒团 IP 系列技能 |
| `wg-1107` | 个人仓库 | 个人技能（当前：随笔 wg-suibi-write） |
| `GitHub` | 工具类 | 本仓库的两个技能 |

## github-tuisong（本地 → GitHub）

将本地 skill 文件推送到 GitHub 仓库的完整工作流：

- 列出本地/远程文件并对比差异
- 获取远程文件 SHA（更新必需）
- Node.js 构建 base64 JSON payload
- `gh api -X PUT` 推送文件（新增或更新）
- README 下载-编辑-推送
- 一键安装命令生成
- 409/422 冲突处理
- 推送后完整性验证

## github-renew-locate（GitHub → 本地）

从 GitHub 仓库拉取 skill 文件并更新到本地：

- 列出远程 skill 目录文件
- 与本地对比差异
- 下载文件到 `~/.qoderworkcn/skills/`
- 验证完整性
- 支持批量拉取多个仓库的多个 skill

## 安装

### github-tuisong

**方式一：QoderWork agent 对话安装**

在 QoderWork agent 对话中发送：

```
请从 https://github.com/WalkGod-Lei/GitHub 安装 github-tuisong skill。
克隆仓库后，把 github-tuisong/ 目录复制到 ~/.qoderworkcn/skills/github-tuisong/，然后验证 SKILL.md 在。
```

**方式二：命令行一键安装**

```bash
mkdir -p ~/.qoderworkcn/skills/github-tuisong && \
curl -sL https://github.com/WalkGod-Lei/GitHub/archive/refs/heads/main.tar.gz | \
tar xz --strip-components=2 -C ~/.qoderworkcn/skills/github-tuisong GitHub-main/github-tuisong
```

### github-renew-locate

**方式一：QoderWork agent 对话安装**

在 QoderWork agent 对话中发送：

```
请从 https://github.com/WalkGod-Lei/GitHub 安装 github-renew-locate skill。
克隆仓库后，把 github-renew-locate/ 目录复制到 ~/.qoderworkcn/skills/github-renew-locate/，然后验证 SKILL.md 在。
```

**方式二：命令行一键安装**

```bash
mkdir -p ~/.qoderworkcn/skills/github-renew-locate && \
curl -sL https://github.com/WalkGod-Lei/GitHub/archive/refs/heads/main.tar.gz | \
tar xz --strip-components=2 -C ~/.qoderworkcn/skills/github-renew-locate GitHub-main/github-renew-locate
```

## 版本记录

### github-tuisong

- **v1.0.0** — 初始版本。完整推送工作流（9 步骤）、execSync 替代方案、409 冲突处理、一键安装命令模板

### github-renew-locate

- **v1.0.0** — 初始版本。拉取更新工作流（6 步骤）、仓库目录结构说明、批量拉取支持
