export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 根路径显示欢迎页
    if (path === '/' || path === '') {
      return new Response(`
        <h1>✅ GitHub 文件代理已成功运行</h1>
        <p>你的仓库：fsdhfgd/tttn</p>
        <p>访问方式：</p>
        <p><a href="/data.json">/data.json</a></p>
        <p><a href="/0707.json">/0707.json</a></p>
        <p><a href="/0821.json">/0821.json</a></p>
      `, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // ==================== 你的仓库配置 ====================
    const owner = "fsdhfgd";     // 你的 GitHub 用户名
    const repo = "tttn";         // 你的仓库名
    const branch = "master";     // 当前分支（从你截图看是 master）
    // ====================================================

    const githubUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}${path}`;

    try {
      const response = await fetch(githubUrl);

      if (!response.ok) {
        return new Response(`❌ 文件不存在: ${path}`, { 
          status: 404,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      }

      const newHeaders = new Headers(response.headers);
      
      // 自动识别文件类型
      if (path.endsWith('.json')) {
        newHeaders.set('Content-Type', 'application/json; charset=utf-8');
      } else if (path.endsWith('.js')) {
        newHeaders.set('Content-Type', 'application/javascript; charset=utf-8');
      } else if (path.endsWith('.html')) {
        newHeaders.set('Content-Type', 'text/html; charset=utf-8');
      } else if (path.endsWith('.md')) {
        newHeaders.set('Content-Type', 'text/markdown; charset=utf-8');
      }

      newHeaders.set('Access-Control-Allow-Origin', '*');
      newHeaders.set('Cache-Control', 'public, max-age=3600');

      return new Response(response.body, {
        status: response.status,
        headers: newHeaders
      });

    } catch (err) {
      return new Response('❌ 请求失败，请稍后重试', { 
        status: 500,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  }
};
