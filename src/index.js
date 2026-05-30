// src/index.js
// Cloudflare Workers 入口文件（必须存在）
export default {
  async fetch(request, env) {
    // 让静态资源正常访问，同时支持所有绑定功能
    return env.ASSETS.fetch(request);
  }
};
