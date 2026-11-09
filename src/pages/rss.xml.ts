import rss from '@astrojs/rss';
import { getPosts } from '../lib/posts';
import { SITE } from '../lib/site';

export async function GET() {
  const posts = await getPosts();
  return rss({
    title: 'Axend guides',
    description: 'Practical guides on grooming, self-care and how face scans work.',
    site: SITE.url,
    items: posts.map((p) => ({ title: p.data.title, description: p.data.description, pubDate: p.data.publishDate, link: `/guides/${p.data.slug}` })),
  });
}
