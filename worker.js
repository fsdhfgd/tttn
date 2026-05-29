export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 简单返回 Hello World
    return new Response(`
      <html>
        <head>
          <title>tttn Worker</title>
          <style>
            body { font-family: system-ui; text-align: center; padding: 50px; }
          </style>
        </head>
        <body>
          <h1>✅ Hello from Cloudflare Worker!</h1>
          <p>项目名称: tttn</p>
          <p>当前路径: ${url.pathname}</p>
        </body>
      </html>
    `, {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
}
