export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 对 JSON 文件特殊处理：添加正确的响应头
    if (url.pathname.endsWith('.json')) {
      const response = await env.ASSETS.fetch(request);
      const newHeaders = new Headers(response.headers);
      
      newHeaders.set('Content-Type', 'application/json; charset=utf-8');
      newHeaders.set('Access-Control-Allow-Origin', '*');
      newHeaders.set('Cache-Control', 'public, max-age=31536000');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }

    // 其他文件正常返回
    return env.ASSETS.fetch(request);
  }
};
