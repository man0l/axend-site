# axend-site

axendai.com: Astro 5 static site on Cloudflare Workers static assets. Tool pages share one on-device scan component (MediaPipe Face Landmarker WASM; photos never leave the browser). Guides are Markdown in `src/content/blog/`.

- `npm run dev` / `npm run build` (copies the MediaPipe runtime into `public/mediapipe`, then `astro build`)
- `node --test src/lib/metrics.test.ts` for the scoring math
- Add a post: drop `src/content/blog/<slug>.md` (file name must equal `slug`; frontmatter is validated by zod; trademark terms in slugs fail the build), push to `main`.
- CI (`.github/workflows/deploy.yml`) builds and runs `wrangler deploy`. Workers Builds is not used.
- `PUBLIC_NOINDEX=1` makes pages `noindex` and `robots.txt` disallow all. Set only for the preview; remove at go-live.
- Preview is `*.workers.dev` only. Do not attach axendai.com until approved.
