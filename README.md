# wg-skills

WG 取自 WalkGod，这里是「走神」个人 AI 体系中对外开放的一部分：可复用的 Skills、工具和工作流。

## Skills

| Skill | Directory | Description | Version |
|-------|-----------|-------------|---------|
| **wg-github-tuisong** | `wg-github-tuisong/` | Local → GitHub: push skill files to remote repos | v1.0.0 |
| **wg-github-renew-locate** | `wg-github-renew-locate/` | GitHub → Local: pull skills from remote repos | v1.0.0 |
| **wg-biji-note-extractor** | `wg-biji-note-extractor/` | Extract notes from biji.com (得到大脑) | v2.1.0 |

## Install

In a QoderWork agent chat:

```
Please install wg-github-tuisong skill from https://github.com/WalkGod-Lei/wg-skills.
Copy the wg-github-tuisong/ directory to ~/.qoderworkcn/skills/wg-github-tuisong/ and verify SKILL.md exists.
```

Or via command line:

```bash
mkdir -p ~/.qoderworkcn/skills/wg-github-tuisong && \
curl -sL https://github.com/WalkGod-Lei/wg-skills/archive/refs/heads/main.tar.gz | \
tar xz --strip-components=2 -C ~/.qoderworkcn/skills/wg-github-tuisong wg-skills-main/wg-github-tuisong
```

## Repo Conventions

| Repo | Purpose |
|------|---------|
| `bystander` | 局外先生 IP skills |
| `la-group` | 懒懒团 LLT IP skills |
| `wg-1107` | Personal skills |
| `wg-skills` | Reusable tools & workflows (this repo) |
