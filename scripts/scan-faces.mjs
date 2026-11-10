// Scans image files with the site's own scanner (src/lib/metrics.ts + MediaPipe Face Landmarker, headless Chromium).
// Usage: node scripts/scan-faces.mjs <out.json> <image ...>   (needs playwright-core and a Chromium; set CHROMIUM_PATH if not auto-found)
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright-core';

const KEEP = process.argv.includes('--keep-landmarks'); // landmarks + symmetry geometry are only needed for the pipeline screenshots
const [out, ...files] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!out || !files.length) { console.error('usage: scan-faces.mjs <out.json> <image ...> [--keep-landmarks]'); process.exit(1); }

const bundle = execFileSync('node_modules/.bin/esbuild', ['scripts/scan-harness.ts', '--bundle', '--format=iife', '--minify'], { maxBuffer: 1 << 26 }).toString();
const MIME = { '.wasm': 'application/wasm', '.js': 'text/javascript', '.task': 'application/octet-stream' };
const server = http.createServer((req, res) => {
  const u = req.url.split('?')[0];
  if (u === '/') { res.setHeader('content-type', 'text/html'); return res.end('<!doctype html><meta charset=utf-8><body>'); }
  if (u === '/harness.js') { res.setHeader('content-type', 'text/javascript'); return res.end(bundle); }
  const f = path.join('public', u);
  if ((u.startsWith('/mediapipe/') || u.startsWith('/models/')) && fs.existsSync(f)) { res.setHeader('content-type', MIME[path.extname(f)] ?? 'application/octet-stream'); return res.end(fs.readFileSync(f)); }
  res.statusCode = 404; res.end();
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const exe = process.env.CHROMIUM_PATH ?? fs.globSync(`${process.env.HOME}/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux*/chrome-headless-shell`).sort().pop();
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto(`http://127.0.0.1:${port}/`);
await page.addScriptTag({ url: '/harness.js' });

const results = [];
for (const f of files) {
  const url = `data:image/png;base64,${fs.readFileSync(f).toString('base64')}`;
  const r = await page.evaluate((u) => window.scan(u), url);
  if (!KEEP) { delete r.landmarks; delete r.sym; }
  results.push({ file: path.basename(f), ...r });
  console.log(path.basename(f), r.faces === 1 ? `overall ${r.overall} jaw ${r.jawAngle}` : `faces=${r.faces}`);
}
await browser.close(); server.close();

const meta = {
  scannerVersion: `metrics.ts@${crypto.createHash('sha1').update(fs.readFileSync('src/lib/metrics.ts')).digest('hex').slice(0, 8)}`,
  mediapipe: JSON.parse(fs.readFileSync('node_modules/@mediapipe/tasks-vision/package.json')).version,
  model: 'face_landmarker.task',
};
fs.writeFileSync(out, JSON.stringify({ ...meta, scannedAt: new Date().toISOString(), results }, null, 1));
