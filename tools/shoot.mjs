/**
 * Visual-fidelity harness.
 *
 * Screenshots a list of URLs at the design's reference viewport so app pages
 * can be diffed against the original Claude Design HTML.
 *
 *   node tools/shoot.mjs <outDir> <name=url> [name=url ...]
 *
 * Viewport is 1480×1020: the design frame is 1440×980 and the app adds 20px of
 * page padding on each side, so at this size every measured pixel should line
 * up with the design source.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const [outDir, ...pairs] = process.argv.slice(2);
if (!outDir || pairs.length === 0) {
  console.error('usage: node tools/shoot.mjs <outDir> <name=url> [...]');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1480, height: 1020 },
  deviceScaleFactor: 1,
  locale: 'ar-SA',
});

for (const pair of pairs) {
  const idx = pair.indexOf('=');
  const name = pair.slice(0, idx);
  const url = pair.slice(idx + 1);

  await page.goto(url, { waitUntil: 'load', timeout: 60_000 });
  // Let webfonts settle — Tajawal/Montserrat load from Google Fonts.
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await page.waitForTimeout(2000);

  const file = resolve(outDir, `${name}.png`);
  await page.screenshot({ path: file });
  console.log(`${name} -> ${file}`);
}

await browser.close();
