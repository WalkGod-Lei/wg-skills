# wg-biji-note-extractor

> 从得到大脑 (biji.com) 知识库中批量提取笔记完整原文 + AI 总结分析

一个面向 AI Agent 的可复用技能（Skill），让 Agent 能够自动从 biji.com 知识库页面中提取每篇笔记的完整原文和 AI 总结，输出为结构化的 Markdown 或 Word 文档。

## 它能做什么

biji.com 是 Vue.js 单页应用，笔记的"完整原文"藏在灰色链接区块背后，点击后通过 `window.open()` 在新标签打开——但浏览器弹窗拦截器会阻止它。

**v2.1 核心改进：**

v2.1 修复了 v2.0 中"侧边栏重排序导致批量提取丢失原文"的致命问题。新流程采用逐篇处理 + 1500ms 等待 + URL 去重 + 多标签并行提取的可靠架构：

1. **逐篇拦截 URL**（~75秒/50篇）：每篇笔记独立执行 click→wait 1500ms→intercept window.open→click gray block→read URL，彻底避免侧边栏重排序导致的索引错位
2. **并行多标签提取**（~65秒/50篇）：创建 4 个额外标签页 + 主标签共 5 路并行，每轮处理 5 篇，约 13 轮完成
3. **批量提取 AI 总结**（~40秒/50篇）：在主知识库页面逐项点击侧边栏读取 main.innerText
4. **Node.js 组装输出**：合并原文 + AI 总结，生成 Markdown 或 Word 文档

整体约 3 分钟完成 50 篇笔记的完整提取。

## 支持的 Agent

| Agent | 技能安装路径 |
|-------|-------------|
| QoderWork CN | `~/.qoderworkcn/skills/` |
| WorkBuddy | `~/.workbuddy/skills/` |
| ProMa | `~/.proma/default-skills/` |

## 一键安装

### 方式一：gh CLI 下载（推荐）

```bash
# macOS / Linux
gh api repos/WalkGod-Lei/wg-skills/tarball | tar xz --strip-components=1 -C ~/.qoderworkcn/skills/wg-biji-note-extractor/ --wildcards '*/SKILL.md' '*/references/*'

# 或从仓库 tarball 安装
gh api tarball -R WalkGod-Lei/wg-skills | tar xz --strip-components=1 -C ~/.qoderworkcn/skills/wg-biji-note-extractor/
```

### 方式二：curl 安装脚本

**macOS / Linux：**

```bash
curl -fsSL https://raw.githubusercontent.com/WalkGod-Lei/wg-skills/main/install.sh | bash
```

**Windows (PowerShell)：**

```powershell
irm https://raw.githubusercontent.com/WalkGod-Lei/wg-skills/main/install.ps1 | iex
```

### 方式三：Agent 对话安装

在任意支持的 Agent 对话中输入：

> 安装 wg-biji-note-extractor 技能：从 https://github.com/WalkGod-Lei/wg-skills 仓库下载 SKILL.md 和 references/ 目录到技能目录

### 方式四：git clone

```bash
git clone https://github.com/WalkGod-Lei/wg-skills.git
cd wg-biji-note-extractor
cp -r SKILL.md references/ ~/.qoderworkcn/skills/wg-biji-note-extractor/
```

## 文件结构

```
wg-biji-note-extractor/
├── SKILL.md                        # 技能主文件（Agent 读取此文件获取操作指南）
├── references/
│   └── troubleshooting.md          # 12 个常见问题的排查指南
├── README.md                       # 本文件
├── install.sh                      # macOS/Linux 一键安装脚本
└── install.ps1                     # Windows PowerShell 一键安装脚本
```

## 使用方式

安装后，在你的 Agent 对话中提到以下关键词即可触发：

- "提取 biji.com 笔记"
- "抓取得到大脑知识库"
- "下载 biji.com 笔记内容"
- 直接提供 `biji.com/subject/...` 格式的链接

Agent 会自动读取 SKILL.md 中的操作指南，通过浏览器自动化完成提取。

## 前置条件

- Agent 需要具备浏览器自动化能力（Browser MCP / Computer Use）
- 用户已登录 biji.com（浏览器中有有效 session）
- 生成 Word 文档需要 Node.js + docx npm 包

## 技术要点

| 技术 | 用途 | 速度 |
|------|------|------|
| window.open 劫持 | 拦截灰色区块点击获取原始笔记 URL | ~75秒/50篇 |
| 多标签并行导航 | 4+1 标签同时加载原文页并提取 | ~65秒/50篇 |
| 侧边栏逐项点击 | 在主页面读取 AI 总结 (main.innerText) | ~40秒/50篇 |
| URL 去重 | 防止侧边栏重排导致的重复提取 | 瞬时 |
| Node.js 组装 | 合并数据输出 Markdown/Word | 瞬时 |

## 变更日志

### v2.1.0 (2026-07-06)

- **修复致命缺陷**：侧边栏 Vue 重排序导致批量循环中索引错位，造成大量原文缺失
- 新增逐篇处理模式（每篇 1500ms 等待），彻底消除重排序影响
- 新增 URL 去重步骤，防止重复提取
- 推荐并行多标签（4+1）提取原文，替代不可靠的 iframe/API 方式
- 简化流程为可靠的浏览器导航方式

### v2.0.0 (2026-07-06)

- 新增 XHR 劫持 API 直取 AI 总结
- 新增同源 iframe 并行提取原文
- 新增 4 个 troubleshooting 条目
- 性能提升 3-4 倍

### v1.0.0 (2026-07-05)

- 初始版本：window.open 中间件劫持 + 逐篇导航提取

## License

MIT
