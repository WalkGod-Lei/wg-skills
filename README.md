# wg-skills

WG 是 WalkGod 的缩写。这里是 WalkGod 个人 AI 系统中公开使用的部分，主要收录可复用的 Skills、工具和工作流。

## 技能目录

| 技能 | 目录 | 功能简介 | 版本 |
|------|------|----------|------|
| **wg-github-tuisong** | `wg-github-tuisong/` | 将本地 Skill 文件同步推送到 GitHub | v1.2.0 |
| **wg-github-renew-locate** | `wg-github-renew-locate/` | 从 GitHub 拉取并更新本地 Skill | v1.0.0 |
| **wg-biji-note-extractor** | `wg-biji-note-extractor/` | 批量提取得到大脑、得到笔记知识库中的完整笔记 | v3.0.0 |
| **wg-insight-engine** | `wg-insight-engine/` | 增强判断、提炼框架并给出更深入的分析建议 | v1.0.0 |
| **wg-cognitive-reconstruction** | `wg-cognitive-reconstruction/` | 通过观点讨论训练理解、论证和个人表达 | v4.0.0 |
| **wg-cognitive-decomposition-coach** | `wg-cognitive-decomposition-coach/` | 先建立完整分析与训练路线两层地图，再用开放问题主动引导用户发现认知盲区 | v1.2.0 |

## 安装方法

### 得到笔记提取 Skill

可以在 Agent 对话中发送：

```text
请从 https://github.com/WalkGod-Lei/wg-skills 安装 wg-biji-note-extractor Skill。
将仓库中的 wg-biji-note-extractor/ 目录复制到本地 skills/wg-biji-note-extractor/，并确认 SKILL.md 和 scripts/extract_biji.cjs 都存在。
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

### 认知剖析训练 Skill

可以在 Agent 对话中发送：

```text
请从 https://github.com/WalkGod-Lei/wg-skills 安装 wg-cognitive-decomposition-coach Skill。
将仓库中的 wg-cognitive-decomposition-coach/ 目录复制到本地 skills/wg-cognitive-decomposition-coach/，并确认 SKILL.md、agents/openai.yaml 和 references/ 下的全部文件都存在。
```

macOS / Linux（以 Codex 为例）：

```bash
mkdir -p ~/.codex/skills/wg-cognitive-decomposition-coach && \
curl -sL https://github.com/WalkGod-Lei/wg-skills/archive/refs/heads/main.tar.gz | \
tar xz --strip-components=2 -C ~/.codex/skills/wg-cognitive-decomposition-coach wg-skills-main/wg-cognitive-decomposition-coach
```

## 仓库说明

- 每个 Skill 目录都包含一个 `SKILL.md`，并可按需要附带 `scripts/`、`references/`、`agents/` 等目录。
- 安装时只需复制目标 Skill 目录，不必复制整个仓库。
- 技术字段、文件名和命令保留英文；能力说明、使用方法和边界说明以中文为主。
