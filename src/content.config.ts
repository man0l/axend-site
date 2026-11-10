import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Trademarked names may appear in honest comparison copy but never in URLs.
const SLUG_BLOCKLIST = ['facetune', 'faceapp', 'chatgpt', 'openai', 'gemini', 'vidnoz', 'media-io', 'mediaio', 'fotor', 'pfpmaker', 'thefacereport', 'facesym', 'umax', 'looksmax-ai', 'rate-my-face', 'pslrater', 'attractivenesstest', 'aiattractivenesstest'];

const TOOL_PATHS = ['/', '/how-attractive-am-i', '/facial-symmetry-test', '/face-attractiveness-test', '/male-attractiveness-test', '/face-rating'] as const;

const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blog' }),
  schema: z
    .object({
      title: z.string().min(10).max(90),
      description: z.string().min(40).max(155),
      slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'slug must be kebab-case'),
      cluster: z.enum(['improve', 'trust', 'compare', 'looksmax']),
      module: z.enum(['skin', 'hair', 'jawline', 'posture', 'smile', 'general']),
      targetKeyword: z.string(),
      tool: z.enum(TOOL_PATHS),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date(),
      heroImage: z.string().optional(),
      sources: z.array(z.object({ title: z.string().min(3), url: z.string().url(), publisher: z.string().min(2) })).optional(),
      faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
      draft: z.boolean().default(false),
    })
    .superRefine((v, ctx) => {
      const hit = SLUG_BLOCKLIST.find((b) => v.slug.includes(b));
      if (hit) ctx.addIssue({ code: 'custom', path: ['slug'], message: `slug contains blocklisted trademark term "${hit}"` });
      const now = new Date();
      if (v.publishDate > now) ctx.addIssue({ code: 'custom', path: ['publishDate'], message: 'publishDate is in the future' });
      if (v.updatedDate > now) ctx.addIssue({ code: 'custom', path: ['updatedDate'], message: 'updatedDate is in the future' });
      if (v.updatedDate < v.publishDate) ctx.addIssue({ code: 'custom', path: ['updatedDate'], message: 'updatedDate is before publishDate' });
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({ title: z.string(), description: z.string().max(155), updated: z.coerce.date() }),
});

export const collections = { blog, pages };
