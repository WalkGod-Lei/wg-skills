---
name: wg-biji-note-extractor
description: Extract complete note content (original text + AI summaries) from biji.com (得到大脑) knowledge bases. Use when the user wants to scrape, extract, or download notes from biji.com knowledge base pages, or mentions 得到笔记/得到大脑/biji.com extraction.
version: 2.1.0
---

# biji.com 笔记提取技能 v2.1

从得到大脑 (biji.com) 知识库中批量提取笔记的完整原文和 AI 总结分析。

## 适用场景

- 用户要求提取/抓取/下载 biji.com 知识库中的笔记内容
- 用户提供了 biji.com/subject/... 格式的链接
- 需要获取笔记的完整原文（不仅仅是页面上显示的摘要）

## 核心难点

biji.com 是 Vue.js 单页应用，存在五个关键障碍：

1. **弹窗拦截**：完整原文在灰色链接区块中，点击后通过 `window.open()` 打开新标签，但浏览器弹窗拦截器会阻止。
2. **侧边栏重排序（致命陷阱）**：每次点击侧边栏笔记后，Vue 会重新渲染并重新排序列表项。这意味着在批量循环中，`querySelectorAll('.sider-list-item')[N]` 在第二次点击后可能指向完全不同的笔记。**这是导致原文缺失的主要原因。**
3. **API 认证复杂**：`knowledge-api.trytalks.com` 的 `v1/web/topic/post/detail` 接口需要 Authorization Bearer token + Xi-Csrf-Token 等 headers，直接调用会返回 `AppNotFound`。token 有效期短（约 30 分钟），且 headers 必须在页面上下文中通过 XHR 拦截器捕获。
4. **SPA 渲染**：fetch + DOMParser 拿到的是空壳 HTML（`<main>` 不存在），必须等 Vue 渲染完成。
5. **JS 变量陷阱**：浏览器 JS 工具中 `const`/`let` 中间变量赋值返回 `undefined`，必须用链式表达式或 `eval()`。

## 提取流程

### 第一步：打开知识库页面 + 确认笔记数量

用浏览器工具导航到用户提供的 biji.com/subject/... URL，记录 tabId。

```javascript
document.querySelectorAll('.sider-list-item').length
```

### 第二步：拦截原始笔记 URL（逐篇处理，禁止批量循环！）

**关键规则：必须逐篇处理，每篇独立执行完整的 click→wait→intercept→click→read 循环。**

对每篇笔记（索引 0 到 N-1），依次执行：

1. 点击侧边栏项：
```javascript
document.querySelectorAll('.sider-list-item')[N].click()
```

2. **等待 1500ms** 让页面完成渲染和侧边栏重排序：
```javascript
new Promise(r => setTimeout(r, 1500)).then(() => 'ready')
```

3. 重置 window.open 拦截器：
```javascript
(window.__origOpen = window.__origOpen || window.open)
  && (window.open = function(url) { window.__urls.push(url); return null; })
  && (window.__urls = [])
  && 'intercepted'
```

4. 点击灰色区块：
```javascript
document.querySelector('.cursor-pointer.rounded-lg.bg-gray-F5F6F7').click()
```

5. 等待 800ms 后读取 URL：
```javascript
new Promise(r => setTimeout(r, 800)).then(() => JSON.stringify(window.__urls))
```

**提速方法**：可将多篇合并为一个 async 函数，但**每篇之间必须间隔 1500ms**：

```javascript
(async () => {
  const results = [];
  const items = document.querySelectorAll('.sider-list-item');
  for (const idx of [0,1,2,3,4,5,6,7,8,9]) {
    items[idx].click();
    await new Promise(r => setTimeout(r, 1500));
    window.__urls = [];
    window.open = function(url) { window.__urls.push(url); return null; };
    const block = document.querySelector('.cursor-pointer.rounded-lg.bg-gray-F5F6F7');
    if (block) {
      block.click();
      await new Promise(r => setTimeout(r, 800));
      results.push({idx, url: window.__urls[0] || null});
    } else {
      results.push({idx, url: 'no-block'});
    }
  }
  return JSON.stringify(results);
})()
```

**每批不超过 10 篇**，每批之间用独立的 async 调用（不共享 items 引用，因为侧边栏会重排）。

### 第三步：并行多标签提取完整原文

**创建 4 个额外标签页**，配合主标签共 5 路并行提取：

1. 创建标签页：`tabs_create_mcp` × 4
2. 同时导航 4 个标签到不同 URL：`navigate` × 4（并行调用）
3. 同时提取内容：`javascript_tool` × 4（并行调用）
```javascript
new Promise(r => setTimeout(r, 1500)).then(() => document.querySelector('main') ? document.querySelector('main').innerText : 'no main')
```
4. 重复步骤 2-3 直到所有 URL 处理完毕

每轮处理 4 篇，约 5 秒/轮。50 篇约 13 轮 ≈ 65 秒。

**去重**：拦截到的 URL 可能有重复（因侧边栏重排），需先对 URL 列表去重再提取。

### 第四步：批量提取 AI 总结

在主知识库页面的主标签上，用 async 循环逐项点击侧边栏并读取 `main.innerText`：

```javascript
(async () => {
  const results = [];
  const items = document.querySelectorAll('.sider-list-item');
  for (let i = START; i < END; i++) {
    items[i].click();
    await new Promise(r => setTimeout(r, 800));
    const main = document.querySelector('main');
    if (main) { results.push({i, text: main.innerText}); }
  }
  return JSON.stringify(results);
})()
```

每批 10 篇，约 8 秒/批。50 篇 = 5 批 ≈ 40 秒。AI 总结内容包含 emoji 标记的分类（💪 核心特质、🔍 关键认知等）。

### 第五步：组装输出

用 Node.js 脚本将完整原文 + AI 总结写入 Markdown 文件。

每篇笔记格式：
```markdown
## 笔记N：标题

**创建时间：** MM月DD日

### 完整原文

（从原始笔记页提取的完整正文）

### AI 总结分析

（从主页面提取的 AI 总结）
```

## 关键 DOM 选择器

| 元素 | 选择器 |
|------|--------|
| 侧边栏笔记列表项 | `.sider-list-item` |
| 灰色链接区块（含完整原文入口） | `.cursor-pointer.rounded-lg.bg-gray-F5F6F7` |
| 笔记标题 | `.note-title` |
| AI 总结内容 | `.note-content` |
| 主内容区 | `main` |

## 常见陷阱

- **侧边栏重排序**：每次点击后列表重排，批量循环中后半段索引指向错误的笔记。解决方案：逐篇处理 + 1500ms 等待。
- **URL 重复**：因侧边栏重排，不同索引可能返回相同 URL。提取原文前必须去重。
- **API AppNotFound**：`knowledge-api.trytalks.com` 需要特定 headers（Authorization + Xi-Csrf-Token），不能裸调。优先使用浏览器导航方式提取。
- **弹窗拦截**：`window.open()` 会被拦截，必须劫持为 URL 记录器。
- **JS 变量陷阱**：用链式表达式或 `eval()` 替代 `const`/`let`。

## 注意事项

- 原文来自抖音视频语音转文字，存在同音字转录误差，保持原文不改
- 原始笔记页包含一个抖音原链接，可记录但不需要访问
- 用 `tabs_create_mcp` 创建新标签页访问原始笔记，避免弹窗拦截问题
- 并行标签页提取是最可靠的加速方式（4 标签 + 主标签 = 5 路并行）
