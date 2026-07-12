# wg-skills

WG 取自 WalkGod，这里是「走神」个人 AI 体系中对外开放的一部分：可复用的 Skills、工具和工作流。

## Skills

| Skill | Directory | Description | Version |
|-------|-----------|-------------|---------|
| **wg-github-tuisong** | `wg-github-tuisong/` | 本地 → GitHub：把本地 skill 文件推送到远程仓库 | v1.0.0 |
| **wg-github-renew-locate** | `wg-github-renew-locate/` | GitHub → 本地：从远程仓库拉取并更新 skill 到本地 | v1.0.0 |
| **wg-biji-note-extractor** | `wg-biji-note-extractor/` | 从 biji.com（得到大脑）知识库批量提取笔记完整原文 + AI 总结 | v2.1.0 |
| **wg-insight-engine** | `wg-insight-engine/` | 正向能力放大器：更强的判断、更深的框架、更高维度的建议 | v1.0.0 |

## Install

在 QoderWork agent 对话中发送：

```
请从 https://github.com/WalkGod-Lei/wg-skills 安装 wg-insight-engine skill。
把 wg-insight-engine/ 目录复制到 ~/.qoderworkcn/skills/wg-insight-engine/，验证 SKILL.md 在。
```

或命令行一键安装：

```bash
mkdir -p ~/.qoderworkcn/skills/wg-insight-engine && \
curl -sL https://github.com/WalkGod-Lei/wg-skills/archive/refs/heads/main.tar.gz | \
tar xz --strip-components=2 -C ~/.qoderworkcn/skills/wg-insight-engine wg-skills-main/wg-insight-engine
```

## About

所有 skill 均为 AI agent（QoderWork、WorkBuddy 等）设计，遵循 SKILL.md 约定。
每个 skill 目录包含 `SKILL.md`（agent 可读的指令文件）和可选的 `references/`（补充文档）。
安装方式：将 skill 目录复制到 agent 的 skills 文件夹，或使用各 skill 目录下提供的安装脚本。
