import { TOOLS } from '../data/tools';
import { getPosts } from '../lib/posts';
import { SITE } from '../lib/site';
export async function GET() {
  const posts = await getPosts();
  const body = `# Axend

> Axend is an iOS grooming and self-care app. This site hosts free, private, on-device face scans (photos never leave the browser) and practical guides. Scores are cosmetic and approximate, for adults 18+, not medical advice.

## Tools
${TOOLS.map((t) => `- [${t.nav}](${SITE.url}${t.path}): ${t.description}`).join('\n')}

## Guides
${posts.map((p) => `- [${p.data.title}](${SITE.url}/guides/${p.data.slug}): ${p.data.description}`).join('\n')}

## About
- [How we score](${SITE.url}/how-we-score)
- [About](${SITE.url}/about)
- [Privacy](${SITE.url}/privacy)
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
