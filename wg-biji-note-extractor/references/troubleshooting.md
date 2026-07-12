# 常见问题与排查

## 1. window.open 拦截器失效

**现象**：点击灰色区块后 `window.__urls` 没有新增 URL。

**原因**：侧边栏切换笔记后 Vue.js 重新渲染组件，可能重置了 `window.open` 引用。

**解决**：每次切换笔记后，立即重新设置拦截器：

```javascript
(window.__origOpen = window.__origOpen || window.open)
  && (window.open = function(url) { window.__urls.push(url); return null; })
  && 're-intercepted'
```

**验证拦截器是否生效**：

```javascript
window.open.toString().substring(0, 80)
// 应返回: "function(url) { window.__urls.push(url); return null; }"
```

## 2. 灰色区块选择器找不到元素

**现象**：`document.querySelector('.cursor-pointer.rounded-lg.bg-gray-F5F6F7')` 返回 null。

**原因**：切换笔记后页面还在渲染中，灰色区块尚未出现。

**解决**：等待 1-2 秒后重试，或用轮询：

```javascript
document.querySelector('.cursor-pointer.rounded-lg.bg-gray-F5F6F7') ? 'found' : 'not found'
```

## 3. 侧边栏虚拟滚动：笔记数量不符

**现象**：`querySelectorAll('.sider-list-item').length` 返回的数字小于知识库实际笔记数。

**原因**：侧边栏使用 `.n-scrollbar-container` 虚拟滚动，DOM 中仅渲染可见项（约 50 项）。

**解决**：以实际 DOM 渲染数为准。如果知识库有超过 50 篇笔记，只有当前 follow 下的可见笔记会被提取。尝试滚动侧边栏加载更多：

```javascript
eval("var sc = document.querySelector('.n-scrollbar-container'); sc.scrollTop = sc.scrollHeight; 'scrolled'")
```

## 4. API 调用返回 AppNotFound

**现象**：直接 fetch `knowledge-api.trytalks.com` 返回 `{"message":"AppNotFound"}`。

**原因**：API 需要完整认证上下文（Authorization Bearer token + Xi-Csrf-Token + x-d + 其他 headers），裸调或仅带部分 headers 会被拒绝。

**解决**：通过 XHR 拦截器从页面自身的 API 调用中捕获完整 headers（见 SKILL.md 步骤 3）。关键 headers 列表：
- `Authorization`: Bearer JWT token（有效期约 30 分钟）
- `Xi-Csrf-Token`: CSRF 防护 token
- `x-d`: 设备标识
- `Xi-App-Client-Source`: 固定为 `getnote`
- `X-Appid`: 固定为 `3`

## 5. Authorization Token 过期

**现象**：之前正常工作的 API 调用突然返回 `{"message":"LoginRequired"}`。

**原因**：JWT token 有效期约 30 分钟（`exp - iat ≈ 1800s`）。

**解决**：重新执行 XHR 拦截流程捕获新 token。点击任意侧边栏项触发 API 调用，从新请求中读取 `Authorization` header。

## 6. fetch 请求挂起或 CORS 错误

**现象**：使用 `fetch()` 调用 API 时 Promise 永远 pending，或报 CORS 错误。

**原因**：从 biji.com 页面 context 发起的 fetch 到 `knowledge-api.trytalks.com` 可能触发 CORS preflight OPTIONS 请求失败。

**解决**：优先使用 `XMLHttpRequest` 代替 `fetch`。XHR 在同源策略下表现更稳定：

```javascript
eval("var xhr = new XMLHttpRequest(); xhr.open('POST', url, true); /* set headers */; xhr.onload = function() { window.__result = xhr.responseText; }; xhr.send(body); 'sent'")
```

## 7. iframe 内容为空

**现象**：iframe onload 后立即读取 `contentDocument.querySelector('main')` 返回 null 或空字符串。

**原因**：biji.com 是 SPA，iframe 加载的是空壳 HTML，需要等待 Vue 渲染完成。

**解决**：onload 后等待 **5 秒** 再读取内容：

```javascript
iframe.onload = function() {
  setTimeout(function() {
    var main = iframe.contentDocument.querySelector('main');
    window.__allTexts[pid] = main ? main.innerText : 'no content';
  }, 5000);
};
```

## 8. fetch + DOMParser 返回原始 HTML

**现象**：通过 `fetch()` 获取笔记页 HTML 后用 `DOMParser` 解析，`querySelector('main')` 返回 null。

**原因**：SPA 页面的 `<main>` 元素由 Vue 在客户端渲染生成，静态 HTML 中不存在。

**解决**：不要用 fetch + DOMParser。使用同源 iframe（自动执行 Vue 渲染）或逐页导航。

## 9. window.location.href 导航销毁 JS 上下文

**现象**：通过 `window.location.href = url` 导航后，之前设置的变量和函数全部丢失。

**原因**：页面导航会销毁整个 JS 执行环境。

**解决**：使用 iframe 在当前页面内加载目标 URL，或者使用 MCP 的 `navigate` 工具逐页导航（每页独立读取）。

## 10. JS 变量赋值返回 undefined

**现象**：`const x = document.querySelector(...)` 在浏览器 JS 工具中返回 undefined。

**原因**：此环境的浏览器 JS 工具对 `const`/`let` 中间变量赋值的返回值处理有缺陷。

**解决**：使用链式表达式（`&&` 连接）或 `eval()` 包装：

```javascript
// 方法1：链式调用
document.querySelector('.foo') && document.querySelector('.foo').click()

// 方法2：eval 包装（适合复杂逻辑）
eval("var x = document.querySelector('.foo'); x.click(); 'clicked'")
```

## 11. 侧边栏点击导致 URL 重复

**现象**：批量收集 post_id 时，连续两个笔记返回相同的 URL 或 post_id。

**原因**：页面渲染延迟，点击下一个侧边栏项时上一个笔记的内容还未完全切换。

**解决**：增加侧边栏点击后的等待时间（从 200ms 增加到 500ms），或在收集后去重：

```javascript
window.__capturedPostIds = [...new Set(window.__capturedPostIds)];
```

## 12. 页面存在 app-error-page 元素

**现象**：页面 HTML 中有多个 `app-error-page` div 和"重新加载"按钮。

**说明**：这些元素默认隐藏（`display: none`），是错误状态的占位符，与内容提取无关。点击它们不会加载完整原文。
