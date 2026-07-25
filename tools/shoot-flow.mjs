/**
 * Interaction screenshots.
 *
 *   node tools/shoot-flow.mjs <outDir> <baseUrl> <name> <path> [step ...]
 *
 * A step is `click:<selector>`, `text:<label>` (click by visible text),
 * `select:<selector>=<value>` or `wait:<ms>`. Same 1480×1020 reference
 * viewport as tools/shoot.mjs.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const [outDir, baseUrl, name, path, ...steps] = process.argv.slice(2);
if (!outDir || !baseUrl || !name || !path) {
  console.error('usage: node tools/shoot-flow.mjs <outDir> <baseUrl> <name> <path> [steps...]');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1480, height: 1020 },
  deviceScaleFactor: 1,
  locale: 'ar-SA',
});

await page.goto(baseUrl + path, { waitUntil: 'load', timeout: 60_000 });
await page.evaluate(() => document.fonts.ready).catch(() => {});
await page.waitForTimeout(1200);

for (const step of steps) {
  const [kind, ...rest] = step.split(':');
  const arg = rest.join(':');
  if (kind === 'click') await page.locator(arg).first().click();
  else if (kind === 'text') await page.getByText(arg, { exact: false }).first().click();
  else if (kind === 'select') {
    const eq = arg.lastIndexOf('=');
    await page.locator(arg.slice(0, eq)).first().selectOption(arg.slice(eq + 1));
  } else if (kind === 'wait') await page.waitForTimeout(Number(arg));
  await page.waitForTimeout(350);
}

const file = resolve(outDir, `${name}.png`);
await page.screenshot({ path: file });
console.log(`${name} -> ${file}`);

await browser.close();
