export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 根路径显示说明
    if (path === '/' || path === '') {
      return new Response(`
        <h1>✅ GitHub 文件代理已运行</h1>
        <p>访问示例：</p>
        <p><a href="/data.json">/data.json</a></p>
        <p><a href="/0707.json">/0707.json</a></p>
      `, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // ==================== 你的仓库配置 ====================
    const owner = "qist";      // 原仓库作者
    const repo = "tvbox";      // 原仓库名
    const branch = "master";   // 你的分支是 master
    // ====================================================

    const githubUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}${path}`;

    try {
      const response = await fetch(githubUrl);

      if (!response.ok) {
        return new Response('❌ 文件不存在或无法访问', { 
          status: 404,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      }

      const newHeaders = new Headers(response.headers);
      
      // 自动设置 Content-Type
      if (path.endsWith('.json')) {
        newHeaders.set('Content-Type', 'application/json; charset=utf-8');
      } else if (path.endsWith('.js')) {
        newHeaders.set('Content-Type', 'application/javascript; charset=utf-8');
      } else if (path.endsWith('.html')) {
        newHeaders.set('Content-Type', 'text/html; charset=utf-8');
      }

      newHeaders.set('Access-Control-Allow-Origin', '*');
      newHeaders.set('Cache-Control', 'public, max-age=3600');

      return new Response(response.body, {
        status: response.status,
        headers: newHeaders
      });

    } catch (err) {
      return new Response('❌ 代理请求失败', { status: 500 });
    }
  }
};
