// Renders the first three pipeline steps (detection, 478 landmarks, ratios) from the scanner's real output on the synthetic face (SLA-1487).
// Step 4 (the score) is a screenshot of the live scanner page, taken by scripts/shoot-scanner.mjs.
// Usage: node scripts/render-pipeline.mjs   (needs src/data/experiments/base-landmarks.json from: scan-faces.mjs --keep-landmarks)
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const D = 'public/guides-exp';
const base = JSON.parse(fs.readFileSync('src/data/experiments/base-landmarks.json')).results[0];
const img = `data:image/png;base64,${fs.readFileSync(`${D}/base.png`).toString('base64')}`;
const exe = process.env.CHROMIUM_PATH ?? fs.globSync(`${process.env.HOME}/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux*/chrome-headless-shell`).sort().pop();
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: base.width, height: base.height } });
await page.setContent('<body style="margin:0;background:#000"><canvas id=c></canvas>');
await page.evaluate(async ({ img, base }) => {
  const im = new Image(); im.src = img; await im.decode();
  const c = document.getElementById('c'); c.width = base.width; c.height = base.height;
  window.draw = (step) => {
    const g = c.getContext('2d'), W = c.width, H = c.height;
    const p = base.landmarks.map(([x, y]) => ({ x: x * W, y: y * H }));
    g.drawImage(im, 0, 0, W, H);
    const dot = (q, r, col) => { g.fillStyle = col; g.beginPath(); g.arc(q.x, q.y, r, 0, 7); g.fill(); };
    const line = (a, b, col, w) => { g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); };
    const lw = Math.max(2, W / 400);
    if (step === 1) {
      const xs = p.map((q) => q.x), ys = p.map((q) => q.y), pad = W * 0.03;
      const x0 = Math.min(...xs) - pad, y0 = Math.min(...ys) - pad, x1 = Math.max(...xs) + pad, y1 = Math.max(...ys) + pad;
      g.strokeStyle = '#e8542a'; g.lineWidth = lw * 1.5; g.strokeRect(x0, y0, x1 - x0, y1 - y0);
      g.fillStyle = '#e8542a'; g.fillRect(x0, y0 - 34, 150, 34); g.fillStyle = '#fff'; g.font = '600 20px sans-serif'; g.fillText('1 face found', x0 + 10, y0 - 11);
    }
    if (step === 2) for (const q of p) dot(q, Math.max(1.6, W / 560), '#f3eadb');
    if (step === 3) {
      const { mid, u, pairs } = base.sym, L = Math.max(W, H);
      for (const q of p) dot(q, 1.4, 'rgba(243,234,219,.35)');
      line({ x: mid.x - u.x * L, y: mid.y - u.y * L }, { x: mid.x + u.x * L, y: mid.y + u.y * L }, '#e8542a', lw);
      for (const [m, real] of pairs) { line(m, real, 'rgba(243,234,219,.7)', lw / 2); dot(m, 4.5, '#3d6fe6'); dot(real, 4.5, '#f3eadb'); }
      for (const i of [9, 2, 152]) line({ x: W * 0.12, y: p[i].y }, { x: W * 0.88, y: p[i].y }, 'rgba(255,214,102,.9)', lw / 1.5); // middle / lower face thirds
      for (const [a, v, b] of [[132, 172, 152], [361, 397, 152]]) { line(p[a], p[v], '#7ed957', lw * 1.3); line(p[v], p[b], '#7ed957', lw * 1.3); dot(p[v], 6, '#7ed957'); } // jaw angle
    }
  };
}, { img, base });
for (const step of [1, 2, 3]) {
  await page.evaluate((s) => window.draw(s), step);
  await page.locator('#c').screenshot({ path: `${D}/pipeline-${step}.png` });
}
await browser.close();
