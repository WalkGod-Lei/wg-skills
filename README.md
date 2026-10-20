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
| **wg-douyin-effect-archive** | `wg-douyin-effect-archive/` | 通过像塑 MCP 只读归档完整工程与美颜参数到 Obsidian，独立分析传播原因并经用户讨论确认定稿 | 初版 |
| **wg-xiangsu-icon** | `wg-xiangsu-icon/` | 生成或修改无文字的像塑特效图标，核验上传尺寸与体积，将可上传成品保存到桌面；不依赖 Obsidian | 初版 |
| **obsidian-research-daily-close** | `obsidian-research-daily-close/` | 日终整合科研记录，同步 Obsidian 中的研究状态，并维护下次组会前任务 | 初版 |

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

### 抖音特效完整归档 Skill

可以在 Agent 对话中发送：

```text
请从 https://github.com/WalkGod-Lei/wg-skills 安装 wg-douyin-effect-archive Skill。
将仓库中的 wg-douyin-effect-archive/ 目录复制到本地 skills/wg-douyin-effect-archive/，并确认 SKILL.md、agents/openai.yaml、references/ 下的全部文件和 assets/effect-archive-template.md 都存在。
```

macOS / Linux（以 Codex 为例）：

```bash
mkdir -p ~/.codex/skills/wg-douyin-effect-archive && \
curl -sL https://github.com/WalkGod-Lei/wg-skills/archive/refs/heads/main.tar.gz | \
tar xz --strip-components=2 -C ~/.codex/skills/wg-douyin-effect-archive wg-skills-main/wg-douyin-effect-archive
```

调用示例：

```text
使用 $wg-douyin-effect-archive 记录当前像塑工程。
来源：他人制作；名称：XXX；投稿量：截图显示19.1万。
先保存完整技术信息，再分析传播原因，等我补充观点并确认后更新正式结论。
```

- 需要可用的像塑 MCP、可访问的工程及本地 Obsidian 知识库；安装 Skill 不会自动安装或连接像塑 MCP。
- 像塑仅通过 MCP 操作，禁止 Computer Use 和其他界面自动化；本任务不修改特效工程。
- 默认归档位置为走神知识库，其他使用者应明确指定自己的 vault 路径；作品分别放入“我制作的特效”和“他人制作的特效”。
- 主档案先展示基本信息，紧接着展示传播分析，再提供完整技术参数；投稿量保留观察日期和来源。
- 技术归档可以先完成，分析独立标记为待确认；用户认可后才定稿，不把投稿量或用户确认当作因果证明。

### 像塑特效图标制作 Skill

可以在 Agent 对话中发送：

```text
请从 https://github.com/WalkGod-Lei/wg-skills 安装 wg-xiangsu-icon Skill。
将仓库中的 wg-xiangsu-icon/ 目录复制到本地 skills/wg-xiangsu-icon/，并确认 SKILL.md 和 agents/openai.yaml 都存在。
```

macOS / Linux（以 Codex 为例）：

```bash
mkdir -p ~/.codex/skills/wg-xiangsu-icon && \
curl -sL https://github.com/WalkGod-Lei/wg-skills/archive/refs/heads/main.tar.gz | \
tar xz --strip-components=2 -C ~/.codex/skills/wg-xiangsu-icon wg-skills-main/wg-xiangsu-icon
```

调用示例：

```text
使用 $wg-xiangsu-icon，按这张已确认效果图制作无文字的正方形特效图标，核验尺寸和体积后把可上传成品放在桌面。
```

- 需要可用的内置图像生成能力；安装本技能不会自动提供图像生成服务。
- 要求完整写在技能中，不读取或写入 Obsidian，不因制作图标而修改特效工程。
- 图标不含名称、标题、字母、数字、界面或水印；特效命名另行在对话中提供。
- 默认建议512×512高质量JPG；按当前已知上传限制，宽高均不超过1280像素、文件小于2,000,000字节，新要求以用户提供的实际入口要求为准。
- 原图保留在工作区，另存可上传文件到实际桌面；交付前检查最终文件的真实尺寸、格式、体积和无文字画面。
- 本地核验不代表平台已接收，不自动上传、提交审核或发布。

### Obsidian 科研日终同步 Skill

可以在 Agent 对话中发送：

```text
请从 https://github.com/WalkGod-Lei/wg-skills 安装 obsidian-research-daily-close Skill。
将仓库中的 obsidian-research-daily-close/ 目录复制到本地 skills/obsidian-research-daily-close/，并确认 SKILL.md 和 agents/openai.yaml 都存在。
```

macOS / Linux（以 Codex 为例）：

```bash
mkdir -p ~/.codex/skills/obsidian-research-daily-close && \
curl -sL https://github.com/WalkGod-Lei/wg-skills/archive/refs/heads/main.tar.gz | \
tar xz --strip-components=2 -C ~/.codex/skills/obsidian-research-daily-close wg-skills-main/obsidian-research-daily-close
```

调用示例：

```text
使用 $obsidian-research-daily-close 整理今天的科研工作并同步 Obsidian。
以下是今天的实测记录、当前推断、已排除项和下一步：……
```

- 仅在用户明确要求日终收尾时调用；需要可访问、可编辑的本地 Obsidian 知识库。
- 默认知识库路径为 `C:\workspace\Obsidian\Lei`；其他使用者应明确指定自己的 vault 路径。
- 同步实验记录、科研推进日志、课题长期记忆、科研首页和下次组会前任务；路线图仅在阶段目标、风险或时间线变化时更新。
- 区分实测事实、当前推断和已撤销结论，以“下次组会前任务”为计划依据；未提供组会日期时，采用两周后的暂定日期并明确标记。

## 仓库说明

- 每个 Skill 目录都包含一个 `SKILL.md`，并可按需要附带 `scripts/`、`references/`、`agents/` 等目录。
- 安装时只需复制目标 Skill 目录，不必复制整个仓库。
- 技术字段、文件名和命令保留英文；能力说明、使用方法和边界说明以中文为主。
