# axend-site

axendai.com: Astro 5 static site on Cloudflare Workers static assets. Tool pages share one on-device scan component (MediaPipe Face Landmarker WASM; photos never leave the browser). Guides are Markdown in `src/content/blog/`.

- `npm run dev` / `npm run build` (copies the MediaPipe runtime into `public/mediapipe`, then `astro build`)
- `node --test src/lib/metrics.test.ts` for the scoring math
- Add a post: drop `src/content/blog/<slug>.md` (file name must equal `slug`; frontmatter is validated by zod; trademark terms in slugs fail the build), push to `main`.
- CI (`.github/workflows/deploy.yml`) builds and runs `wrangler deploy`. Workers Builds is not used.
- `PUBLIC_NOINDEX=1` makes pages `noindex` and `robots.txt` disallow all. Preview only; not set in production since go-live.
- Preview is `*.workers.dev` only. Do not attach axendai.com until approved.

## Synthetic-face experiments (SLA-1487)

Four guides carry a "How we tested" box and tables generated from `src/data/experiments/scans.json` (`experiment:` frontmatter key). Re-run order:
1. `OPEN_ROUTER_API_KEY=... node scripts/gen-experiments.mjs` makes the base face and single-change edits into `public/guides-exp/` (raw PNGs keep their C2PA AI metadata; every call is logged in `generation-log.json`).
2. `python3 scripts/derive-experiments.py` makes the mirrored/tilted derivatives and WebP thumbnails.
3. `node scripts/scan-faces.mjs src/data/experiments/scans.json public/guides-exp/*.png` scans with the site's own `analyze()` in headless Chromium (dev-only: `playwright-core`; set `CHROMIUM_PATH` if no Playwright Chromium is installed). Add `--keep-landmarks` for the base face to refresh `base-landmarks.json`.
4. `node scripts/render-pipeline.mjs` and `node scripts/shoot-scanner.mjs <preview url>` redo the pipeline screenshots.
