# wg-skills

WG is short for WalkGod. This is the public-facing part of the WalkGod personal AI system: reusable Skills, tools, and workflows.

## Skills

| Skill | Directory | Description | Version |
|-------|-----------|-------------|--------|
| **wg-github-tuisong** | `wg-github-tuisong/` | Push local skill files to GitHub repos (gh api + MCP push_files) | v1.2.0 |
| **wg-github-renew-locate** | `wg-github-renew-locate/` | Pull and update skills from GitHub repos to local | v1.0.0 |
| **wg-biji-note-extractor** | `wg-biji-note-extractor/` | Batch extract notes from biji.com knowledge bases via API | v3.0.0 |
| **wg-insight-engine** | `wg-insight-engine/` | Positive capability amplifier: stronger judgment, deeper frameworks, better advice | v1.0.0 |
| **wg-cognitive-reconstruction** | `wg-cognitive-reconstruction/` | Bounded opinion discussion: train absorption, argumentation logic, and personal language | v4.0.0 |
| **wg-cognitive-decomposition-coach** | `wg-cognitive-decomposition-coach/` | Hidden coach map with Socratic guidance and knowledge, evidence, and language scaffolds | v1.1.1 |

## Install

Send in an Agent conversation:

```text
Please install the wg-biji-note-extractor skill from https://github.com/WalkGod-Lei/wg-skills.
Copy the wg-biji-note-extractor/ directory to local skills/wg-biji-note-extractor/, verify SKILL.md and scripts/extract_biji.cjs both exist.
```

macOS / Linux (Codex example):

```bash
mkdir -p ~/.codex/skills/wg-biji-note-extractor && \
curl -sL https://github.com/WalkGod-Lei/wg-skills/archive/refs/heads/main.tar.gz | \
tar xz --strip-components=2 -C ~/.codex/skills/wg-biji-note-extractor wg-skills-main/wg-biji-note-extractor
```

Windows PowerShell one-click install:

```powershell
irm https://raw.githubusercontent.com/WalkGod-Lei/wg-skills/main/wg-biji-note-extractor/install.ps1 | iex
```

Install the cognitive decomposition coach in an Agent conversation:

```text
Please install the wg-cognitive-decomposition-coach skill from https://github.com/WalkGod-Lei/wg-skills.
Copy the wg-cognitive-decomposition-coach/ directory to local skills/wg-cognitive-decomposition-coach/ and verify SKILL.md, agents/openai.yaml, and all references exist.
```

macOS / Linux (Codex example):

```bash
mkdir -p ~/.codex/skills/wg-cognitive-decomposition-coach && \
curl -sL https://github.com/WalkGod-Lei/wg-skills/archive/refs/heads/main.tar.gz | \
tar xz --strip-components=2 -C ~/.codex/skills/wg-cognitive-decomposition-coach wg-skills-main/wg-cognitive-decomposition-coach
```

## About

All skills are designed for AI agents (Codex, QoderWork, WorkBuddy, etc.) and follow the `SKILL.md` convention.
Each skill directory contains `SKILL.md`, and optionally `scripts/`, `references/`, and `agents/`.
Installation: copy the target skill directory to the agent's skills folder, or use the provided install script.
