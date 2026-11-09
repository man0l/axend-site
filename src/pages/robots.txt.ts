import { SITE } from '../lib/site';
export function GET() {
  const body = SITE.noindex
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap-index.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
