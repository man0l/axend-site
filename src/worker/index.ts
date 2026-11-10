interface Env { ASSETS: { fetch(request: Request): Promise<Response> } }

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.hostname === 'www.axendai.com') {
      url.hostname = 'axendai.com';
      return Response.redirect(url.toString(), 301);
    }
    // Canonical sitemap URL; the integration emits sitemap-index.xml.
    if (url.pathname === '/sitemap.xml') {
      url.pathname = '/sitemap-index.xml';
      return env.ASSETS.fetch(new Request(url, request));
    }
    return env.ASSETS.fetch(request);
  },
};
