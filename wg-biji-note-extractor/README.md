# wg-biji-note-extractor

批量提取得到大脑（`biji.com`）知识库中的完整原文、AI 总结、元数据和来源链接，并可继续生成经过渲染检查的 Word 文档。

## v3 的主要变化

- 从逐条点击页面改为 API 优先：自动解析主题 ID、分页抓全列表、并发读取详情。
- 不再把知识库别名、`followId`、页数或“139 条”写死。
- 内置 [scripts/extract_biji.cjs](scripts/extract_biji.cjs)，统一完成令牌刷新、重试、字段映射和完整性校验。
- 登录令牌不写入导出文件；支持只读 Chrome Local Storage 快照，任务结束后可安全清理。
- 对总数、唯一 ID、空标题、空原文和空总结做强校验；结果不完整时不会宣称“全部提取”。
- Vue 侧边栏操作只保留为 API 失效后的兜底，避免重排和虚拟滚动导致漏项。

## 使用

安装后在 Agent 对话中提供完整 `biji.com/subject/...?...followId=...` 链接，例如：

> 用 `$wg-biji-note-extractor` 把这个知识库的全部笔记提取出来，整合成 Word。

前置条件：

- 用户当前账号有权访问目标内容；
- Chrome 中已登录 `biji.com`；
- Node.js 18+；脚本读取 Chrome 快照时临时安装 `level@10`；
- 读取浏览器 Local Storage 前取得用户明确授权。

完整操作与安全边界见 [SKILL.md](SKILL.md)，接口变化排查见 [references/troubleshooting.md](references/troubleshooting.md)。

## 文件结构

```text
wg-biji-note-extractor/
├── SKILL.md
├── agents/openai.yaml
├── scripts/extract_biji.cjs
├── references/troubleshooting.md
├── install.ps1
└── install.sh
```

## 安装脚本

安装器会检测 Codex、QoderWork CN、WorkBuddy 和 ProMa 的技能目录，并下载运行所需的全部文件。

```powershell
irm https://raw.githubusercontent.com/WalkGod-Lei/wg-skills/main/wg-biji-note-extractor/install.ps1 | iex
```

```bash
curl -fsSL https://raw.githubusercontent.com/WalkGod-Lei/wg-skills/main/wg-biji-note-extractor/install.sh | bash
```

## v3.0.0 验证记录

- 使用真实 139 条知识库完成回归：3 页列表、139 个唯一 ID、标题/原文/总结零空缺。
- 与已交付基准逐条比较标题、原文、总结、来源和笔记链接，差异为 0。
- 技能 frontmatter、界面元数据和 Node.js 脚本均通过本地校验。

## License

MIT
