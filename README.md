# wg-skills

WG 取自 WalkGod，这里是「走神」个人 AI 体系中对外开放的一部分：可复用的 Skills、工具和工作流。

## Skills

### General

| Skill | Directory | Description | Version |
|-------|-----------|-------------|---------|
| **wg-github-tuisong** | `wg-github-tuisong/` | 本地 → GitHub：把本地 skill 文件推送到远程仓库 | v1.0.0 |
| **wg-github-renew-locate** | `wg-github-renew-locate/` | GitHub → 本地：从远程仓库拉取并更新 skill 到本地 | v1.0.0 |
| **wg-biji-note-extractor** | `wg-biji-note-extractor/` | API 优先批量提取得到大脑知识库完整原文、AI 总结并生成文档 | v3.0.0 |
| **wg-insight-engine** | `wg-insight-engine/` | 正向能力放大器：更强的判断、更深的框架、更高维度的建议 | v1.0.0 |

### Obsidian

Skills for building and maintaining personal knowledge bases with [Obsidian](https://obsidian.md/).

| Skill | Directory | Description | Version |
|-------|-----------|-------------|---------|
| **wg-copy-intake** | `obsidian/wg-copy-intake/` | 走神文案库入库工作流：先分析分类方案、等用户确认后再写入 vault | v1.0.0 |

## Install

在 Agent 对话中发送：

```text
请从 https://github.com/WalkGod-Lei/wg-skills 安装 wg-biji-note-extractor skill。
把 wg-biji-note-extractor/ 目录复制到本地 skills/wg-biji-note-extractor/，验证 SKILL.md 和 scripts/extract_biji.cjs 均存在。
```

macOS / Linux（以 Codex 为例）：

```bash
mkdir -p ~/.codex/skills/wg-biji-note-extractor && \
curl -sL https://github.com/WalkGod-Lei/wg-skills/archive/refs/heads/main.tar.gz | \
tar xz --strip-components=2 -C ~/.codex/skills/wg-biji-note-extractor wg-skills-main/wg-biji-note-extractor
```

Windows PowerShell 一键安装：

```powershell
irm https://raw.githubusercontent.com/WalkGod-Lei/wg-skills/main/wg-biji-note-extractor/install.ps1 | iex
```

## About

所有 skill 均为 AI agent（Codex、QoderWork、WorkBuddy 等）设计，遵循 `SKILL.md` 约定。
每个 skill 目录包含 `SKILL.md`，并可按需包含 `scripts/`、`references/` 和 `agents/`。
安装方式：将目标 skill 目录完整复制到 agent 的 skills 文件夹，或使用该目录提供的安装脚本。
