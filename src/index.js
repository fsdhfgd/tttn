export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 如果访问根路径，显示简单说明
    if (path === '/' || path === '') {
      return new Response(`
        <h1>GitHub 文件代理</h1>
        <p>使用方法：</p>
        <p>https://你的worker.workers.dev/文件名</p>
        <p>例如：/data.json 或 /README.md</p>
      `, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // 构建 GitHub Raw 地址
    // 请把下面仓库信息改成你自己的
    const owner = '你的GitHub用户名';           // ← 修改这里
    const repo = '你的仓库名';                   // ← 修改这里
    const branch = 'main';                       // 一般是 main 或 master

    const githubUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}${path}`;

    try {
      const response = await fetch(githubUrl);

      if (!response.ok) {
        return new Response('文件不存在或无法访问', { status: 404 });
      }

      const newHeaders = new Headers(response.headers);
      
      // 根据文件后缀自动设置 Content-Type
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
      return new Response('代理请求失败', { status: 500 });
    }
  }
};
