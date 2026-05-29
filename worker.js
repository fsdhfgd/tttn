export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // 去掉开头的斜杠
    if (pathname.startsWith('/')) {
      pathname = pathname.slice(1);
    }

    // 默认首页
    if (pathname === '' || pathname === '/') {
      return new Response(`
        <html>
          <head><title>tttn Worker</title></head>
          <body style="font-family: system-ui; text-align: center; padding: 50px;">
            <h1>✅ tttn Worker 已启动</h1>
            <p>支持直接访问仓库中的文件</p>
            <p>示例：<a href="/jsm.json">/jsm.json</a></p>
          </body>
        </html>
      `, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    try {
      // 尝试从 KV 或嵌入资源中获取（Cloudflare Workers 静态文件方式）
      // 这里我们用最简单的方式：直接返回对应文件内容（需 wrangler.toml 配置 assets）
      return env.ASSETS.fetch(request);
    } catch (e) {
      // 如果上面失败，返回 404
      return new Response('404 Not Found - 文件不存在', { status: 404 });
    }
  }
}
