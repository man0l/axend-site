// Step 4 of the pipeline guide: a real screenshot of the live scanner page scoring the synthetic base face (SLA-1487).
// Usage: npx astro preview --port 4399 &  node scripts/shoot-scanner.mjs [baseUrl]
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const url = process.argv[2] ?? 'http://127.0.0.1:4399';
const exe = process.env.CHROMIUM_PATH ?? fs.globSync(`${process.env.HOME}/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux*/chrome-headless-shell`).sort().pop();
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 1 });
await page.goto(`${url}/face-attractiveness-test`);
await page.locator('.age').first().click(); // custom checkbox: click its label
await page.setInputFiles('#file', 'public/guides-exp/base.png');
await page.waitForSelector('#result[data-state="result"]', { timeout: 60000 });
await page.addStyleTag({ content: 'header { display: none !important }' }); // the sticky site header would overlap the element screenshot
await page.waitForTimeout(1500); // let the score ring animation finish
await page.locator('#result').screenshot({ path: 'public/guides-exp/pipeline-4.png' });
await browser.close();
