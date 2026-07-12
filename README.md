# wg-skills

WG stands for WalkGod. This is the public-facing part of my personal AI system — reusable skills, tools, and workflows for AI agents.

## Skills

| Skill | Directory | Description | Version |
|-------|-----------|-------------|---------|
| **wg-github-tuisong** | `wg-github-tuisong/` | Local → GitHub: push skill files to remote repos | v1.0.0 |
| **wg-github-renew-locate** | `wg-github-renew-locate/` | GitHub → Local: pull skills from remote repos | v1.0.0 |
| **wg-biji-note-extractor** | `wg-biji-note-extractor/` | Extract notes from biji.com knowledge bases | v2.1.0 |
| **wg-insight-engine** | `wg-insight-engine/` | Positive runtime amplifier: stronger judgment, deeper framing, senior-level recommendations | v1.0.0 |

## Install

In a QoderWork agent chat:

```
Please install wg-insight-engine skill from https://github.com/WalkGod-Lei/wg-skills.
Copy the wg-insight-engine/ directory to ~/.qoderworkcn/skills/wg-insight-engine/ and verify SKILL.md exists.
```

Or via command line:

```bash
mkdir -p ~/.qoderworkcn/skills/wg-insight-engine && \
curl -sL https://github.com/WalkGod-Lei/wg-skills/archive/refs/heads/main.tar.gz | \
tar xz --strip-components=2 -C ~/.qoderworkcn/skills/wg-insight-engine wg-skills-main/wg-insight-engine
```

## About

All skills here are designed for AI agents (QoderWork, WorkBuddy, etc.) that support the SKILL.md convention.
Each skill directory contains a `SKILL.md` (the agent-readable instruction file) and optional `references/` (supplementary docs).
Install by copying the skill directory to your agent's skills folder, or use the install scripts provided in each skill directory.
