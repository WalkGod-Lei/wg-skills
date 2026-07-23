---
name: wg-copy-intake
description: 走神 IP 文案库新文案入库工作流。当用户要把一条或多条文案加入 WalkGod vault 的文案库时，先分析并提出分类标注方案（scene/topic/emotion/platform/style/status + 导航页归属区块），等用户明确同意后才创建 Atomic Note 写入 vault。This skill should be used when the user supplies copywriting/captions to file into the 走神 Obsidian vault and expects a confirm-before-write intake flow rather than auto-filing.
agent_created: true
---

# 走神文案入库工作流（先确认后写入）

## 何时使用
当用户给你一条或多条文案，要加入 `D:\workforce\Obsidian\WalkGod\02-内容\认知仓库\文案库\` 时，使用本流程。典型触发语："记录这条文案""加进文案库""这条归哪"。

## 铁律：先确认后写入
**不要**一拿到文案就建文件写进 vault。必须先把分类方案告诉用户、等用户明确同意，再落盘。用户已明确：客观分类有时与其主观意图有差距，最终分类权在用户。

## 标准流程

### 1. 分析文案
读取文案语义，判断：
- 是否有具体场景（徒步/登山/国外旅行/雪山/城市/日落…）→ 填 `scene`
- 讨论的抽象主题（时间/人生/友情…）→ 填 `topic`
- 读者主要情绪 → 填 `emotion`
- 适合发布的平台 → 填 `platform`
- 表达风格 → 填 `style`
- 发布状态 → 填 `status`（未发布 / 已发布抖音 / 已发布朋友圈）

### 2. 提出分类方案（等确认）
用文字告诉用户：
- 打算标的字段值（scene/topic/emotion/platform/style/status 各是什么）
- 会落进 `02-内容/认知仓库/文案导航.md` 的哪几个区块

示例输出：
> 这条我打算标：
> - scene: []（无具体场景）
> - topic: [时间, 人生, 变化]
> - emotion: [共鸣, 平静]
> - platform: [朋友圈, 抖音]
> - style: [哲思, 留白]
> - status: 未发布
> 会落进：✨通用文案、💬朋友圈文案、🎵抖音文案（不进已发布，因为未发布）
> 确认后我就写库。

### 3. 等用户同意
**停在这一步，不要写文件。** 直到用户说「可以」「同意」「写吧」等明确确认。

### 4. 用户同意后写库
按 Atomic Note 规范建单文件：
- 文件名：文案第一句话，超 30 字截断，重名加 (1)/(2)
- Frontmatter：`type: 文案` + 上面确认过的字段 + `created: YYYY-MM-DD`
- 正文：原文（> 引用块，按标点自然断行）
- `## AI 分析`：一句话总结 / 为什么优秀 / 适用场景 / 可改写方向 / 核心关键词
- `## 双向链接`：scene 优先取 1-3 个 [[场景概念]]，不足用 topic 补足

### 5. 同步双日志
写入 vault 后，同时更新：
- `D:\workforce\WorkBuddy\.workbuddy\memory\YYYY-MM-DD.md`（内部）
- `D:\workforce\Obsidian\WalkGod\04-日志\YYYY-MM-DD.md`（vault）

## 平台分流规则（已与用户达成共识，维持现状）
- **朋友圈**：仅旅行文案（徒步/登山/国外旅行/城市/雪山/日落…）+ 老友相聚/出去玩（scene=朋友 或 topic=友情）
- **抖音**：幽默/自嘲/伤感/遗憾/孤独等情绪类，以及人生感悟/生活/时间等中性文案
- 约 18 篇「旅行场景但自嘲/伤感」按「情绪 > 旅行」优先级留抖音（用户确认维持现状）
- 情绪类（幽默/自嘲/伤感/遗憾/孤独）只在抖音，不进朋友圈

## 例外（无需逐条确认）
- 纯结构/配置类操作（导航页查询、字段精简等已达成共识的批量任务）按既定决策执行
- 已发布的文案：只出现在「已发布」区块，不进前置分类（导航页查询已用 `AND status="未发布"` 过滤）

## 字段规范速查
最终字段顺序：`type → scene → topic → emotion → platform → style → status → created`
- 已删除 source/favorite/published
- scene/topic/emotion/platform/style 均为多值列表
- status 三档：未发布 / 已发布抖音 / 已发布朋友圈
- scene 最核心，紧跟 type，优先识别「徒步」「国外旅行」
