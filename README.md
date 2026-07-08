# github-tuisong

QoderWork 技能：将本地 skill 文件同步推送到 GitHub 仓库的完整工作流。

## 功能

覆盖 skill 推送的完整流程：

- 列出本地/远程文件并对比差异
- 获取远程文件 SHA（更新必需）
- Node.js 构建 base64 JSON payload
- `gh api -X PUT` 推送文件（新增或更新）
- README 下载-编辑-推送
- 一键安装命令生成
- 409 冲突处理
- 推送后完整性验证

## 仓库命名惯例

| 仓库 | 含义 | 用途 |
|------|------|------|
| `bystander` | 局外先生 (juwai-xiansheng) | 局外先生 IP 系列技能 |
| `la-group` | 懒懒团 (LLT) | 懒懒团 IP 系列技能 |
| `github-tuisong` | 工具类 | 本技能自身 |

## 常见问题

- **execSync 路径转义失败**：Windows 上 gh.exe 路径含反斜杠和空格，在 Node.js execSync 中调用失败。替代方案：分步执行（Bash 调 gh → Read/Edit 处理本地文件 → Node.js 构建 payload → Bash 调 gh 推送）
- **409 冲突**：文件已成功推送，SHA 已过期。不是错误，是确认
- **Grep/findstr 不可用**：Windows 上 ripgrep 可能 ENOENT，findstr 有编码问题。用 Node.js 替代

## 安装

### 方式一：QoderWork agent 对话安装

在 QoderWork agent 对话中发送：

```
请从 https://github.com/WalkGod-Lei/github-tuisong 安装 github-tuisong skill。
克隆仓库后，把 SKILL.md 复制到 ~/.qoderworkcn/skills/github-tuisong/，然后验证 SKILL.md 在。
```

### 方式二：命令行一键安装（curl + tar，无需 git）

```bash
mkdir -p ~/.qoderworkcn/skills/github-tuisong && \
curl -sL https://github.com/WalkGod-Lei/github-tuisong/archive/refs/heads/main.tar.gz | \
tar xz --strip-components=1 -C ~/.qoderworkcn/skills/github-tuisong
```

## 版本记录

- **v1.0.0** — 初始版本。完整推送工作流（9 步骤）、execSync 替代方案、409 冲突处理、一键安装命令模板
