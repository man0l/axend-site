import { getCollection, type CollectionEntry } from 'astro:content';
import { CLUSTERS, type ClusterKey } from './site';

export type Post = CollectionEntry<'blog'>;

/** Published posts, newest first. Fails the build if a file name does not match its slug. */
export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('blog', (p) => !p.data.draft);
  for (const p of all) {
    if (p.filePath && !p.filePath.endsWith(`/${p.data.slug}.md`)) throw new Error(`Post file ${p.filePath} must be named ${p.data.slug}.md`);
  }
  return all.sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime() || a.data.slug.localeCompare(b.data.slug));
}

export const clusterOf = (p: Post) => CLUSTERS[p.data.cluster as ClusterKey];

export function related(post: Post, all: Post[], n = 4): Post[] {
  return all
    .filter((p) => p.data.slug !== post.data.slug)
    .map((p) => ({ p, s: (p.data.module === post.data.module && post.data.module !== 'general' ? 2 : 0) + (p.data.cluster === post.data.cluster ? 1 : 0) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((x) => x.p);
}
