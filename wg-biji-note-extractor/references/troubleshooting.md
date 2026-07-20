# 故障排查

仅在主流程失败时读取本文件。优先修复 API/认证问题，不要立即退回逐条点击。

## 1. 找不到登录令牌

**现象**：`No biji.com login token found`。

检查：

1. 用户是否已在目标 Chrome 配置文件登录并能打开该知识库；
2. 快照是否来自正确的 `Default` 或 `Profile N`；
3. 快照是否包含 `.ldb`、`.log`、`CURRENT`、`MANIFEST-*` 等 LevelDB 文件；
4. `NODE_PATH` 是否指向安装了 `level@10` 的临时 `node_modules`。

不要要求用户把 token 粘贴进聊天。可以重新生成任务临时快照，或在已登录的 `biji.com` 页面上下文中执行同源提取。

## 2. LevelDB 锁定或损坏

**现象**：`LOCK`、`IO error`、`Corruption` 或文件复制失败。

- 不要写入或修复 Chrome 原始数据库。
- 复制整个 `leveldb` 目录，而不是只复制一个 `.log` 文件。
- 对快照以 `readOnly: true` 打开。
- 若 Chrome 正在写入导致快照不一致，重新复制一次；仍失败时才让用户关闭 Chrome 后重试。

## 3. 刷新令牌失败

**现象**：刷新端点返回 401、`LoginRequired`，或没有新 token。

- 当前访问 token 仍可能有效，脚本会尝试继续；随后列表请求也失败则说明登录态已过期。
- 让用户在 Chrome 中重新登录/刷新目标页面，再重新制作快照。
- 不创建 OpenAPI Key 作为替代。站点 OpenAPI 可能要求付费权限，且与 Web 会话接口不是同一认证体系。

## 4. `AppNotFound` 或认证错误

确认每次请求都带有：

```text
Authorization: Bearer <短期 token>
X-Appid: 3
X-Av: 1.2.2
Xi-App-Client-Source: getnote
Xi-Client-Source: web
X-Request-ID: <每次请求新的 UUID>
x-d: <若登录态中存在 device_id>
```

已验证的 Web API 路线不要求自行伪造 `Xi-Csrf-Token`。若站点以后新增必需头，从已登录页面的真实网络请求中确认，不能猜。

## 5. 主题 ID 解析失败

主题别名来自 `/subject/<alias>/...`。用以下目录接口解析数字 `topic_id`：

```text
GET /v1/web/topic/resource/list/mix
  ?topic_id=-1
  &topic_id_alias=<alias>
  &sort=create_time_desc
  &resource_type=0
  &page=1
```

常见位置是 `c.current_directory.topic_id`。若结构变化，在浏览器网络面板中检查目标页对应响应并更新字段映射；不要把某个知识库的数字 ID 写死。

## 6. 缺少 `followId`

`follow/account/posts` 需要 `topic_id` 和 `follow_id`。优先从用户链接的 `followId` 查询参数读取。若链接没有：

- 查看浏览器最终 URL 是否跳转后补全；
- 检查页面加载时的 `follow/account/posts` 请求体；
- 无法确认时向用户索取完整链接，不要枚举或猜测 ID。

## 7. 分页数量不符

- 固定 `page_size=50`，从第 1 页递增。
- 当累计数量达到 API `total`，或末页条数小于 50 时停止。
- 对所有 `post_id_str` 去重；发现重复 ID 时整次重跑，避免页面更新期间跨页漂移。
- 用户给出的数量与 API 总数不一致时，重新加载页面确认是否近期新增/删除，并在交付中说明基准时间。

## 8. 详情为空或字段变化

详情请求体应为：

```json
{
  "topic_id": -1,
  "topic_id_alias": "<alias>",
  "post_id": "<字符串 ID>",
  "load_media_text": true
}
```

字段优先级：

- 原文：`post_media_text` → `post_content` / `post_text` / `content`
- 总结：`post_cleaned_summary` → `post_summary`
- 标题：`post_name` → `post_title`

部分手写笔记可能天然没有媒体转写，部分新笔记可能尚未生成 AI 总结。先在页面抽查该条，再决定是合法空值还是提取失败。

## 9. 429、5xx 或连接中断

- 将并发从默认 6 降到 2–4；不要超过 12。
- 对 429/5xx 和短暂网络错误使用指数退避，最多重试 3 次。
- 保持详情结果按原列表索引回填，不能按响应完成顺序打乱。
- 若多次失败，保存失败 ID 清单并停止完整性交付，不要遗漏后继续宣称“全部”。

## 10. 浏览器工具不稳定

浏览器控制桥接超时不等于站点接口不可用。优先切换到本地只读快照 + 脚本路线。若必须使用页面上下文：

- 让令牌始终留在页面 JavaScript 内；
- 直接调用分页和详情 API，并触发 JSON 下载；
- 避免把大批正文作为工具返回值传回。

## 11. UI 兜底重复或漏项

Vue 会重渲染和重排侧边栏，长期保存的 DOM 节点或索引会失效。每次切换后重新查询元素，并以 `post_id`/详情链接去重。虚拟滚动还会让 DOM 数量小于实际总数，因此 DOM 元素数量不能作为最终完整性依据。

## 12. Word 文档页数异常

- 不要强制每条笔记另起一页；封面后采用连续流更紧凑。
- 标题识别应基于结构化字段，不要把 AI 总结中的中文短句误判为标题。
- 使用真实 Word 编号/项目符号和超链接。
- 渲染全部页面，检查空白页、孤行、截断、字体替换、链接和末页完整性。
