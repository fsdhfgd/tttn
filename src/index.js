export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
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

    return env.ASSETS.fetch(request);
  }
};
