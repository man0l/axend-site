// Guide illustrations (SLA-1486). Markdown `![alt](/guides-img/x.png "caption")` becomes a lazy-loaded
// <figure> with an "Illustration (AI-generated)" caption. The same list feeds ImageObject JSON-LD.
import fs from 'node:fs';
import path from 'node:path';

export const IMG_PREFIX = '/guides-img/';
export const AI_LABEL = 'Illustration (AI-generated)';
const IMG_RE = /!\[([^\]]*)\]\((\/guides-img\/[a-z0-9-]+\.png)(?:\s+"([^"]*)")?\)/g;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function readImage(url) {
  const file = path.join(process.cwd(), 'public', url);
  if (!fs.existsSync(file)) throw new Error(`Guide image missing: ${url}`);
  const b = fs.readFileSync(file);
  // Raw PNG bytes only: re-encoding would drop the C2PA manifest, which must stay for AI-generated images.
  if (!b.includes('caBX')) throw new Error(`Guide image lost its C2PA AI metadata: ${url}`);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

export const captionFor = (title) => (title ? `${title.replace(/\.$/, '')}. ${AI_LABEL}` : AI_LABEL);

export function extractImages(body = '') {
  return [...body.matchAll(IMG_RE)].map(([, alt, url, title]) => ({ alt, url, caption: captionFor(title), ...readImage(url) }));
}

export function remarkGuideFigures() {
  return (tree) => {
    const walk = (node) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        const img = child.type === 'paragraph' && child.children.length === 1 && child.children[0].type === 'image' ? child.children[0] : null;
        if (img && img.url.startsWith(IMG_PREFIX)) {
          const { width, height } = readImage(img.url);
          const html = `<figure class="guide-fig${width === height ? ' sq' : ''}"><img src="${esc(img.url)}" alt="${esc(img.alt ?? '')}" width="${width}" height="${height}" loading="lazy" decoding="async"><figcaption>${esc(captionFor(img.title))}</figcaption></figure>`;
          return { type: 'html', value: html };
        }
        walk(child);
        return child;
      });
    };
    walk(tree);
  };
}
