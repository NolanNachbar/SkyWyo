import { chromium } from 'playwright';

const URL = process.argv[2] || 'http://localhost:4322/';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForSelector('canvas', { timeout: 15000 });
// Give the preloader + first draw a moment.
await page.waitForTimeout(2500);

// Helper: hash the canvas pixels so we can tell if the frame changed.
async function canvasSignature() {
  return page.evaluate(() => {
    const c = document.querySelector('canvas');
    if (!c) return null;
    const ctx = c.getContext('2d');
    const { data } = ctx.getImageData(0, 0, c.width, c.height);
    let sum = 0, nonBlack = 0;
    for (let i = 0; i < data.length; i += 4 * 997) {
      sum = (sum + data[i] * 3 + data[i + 1] * 5 + data[i + 2] * 7) % 1e9;
      if (data[i] + data[i + 1] + data[i + 2] > 24) nonBlack++;
    }
    return { sum, nonBlack };
  });
}

const top = await canvasSignature();
await page.screenshot({ path: '/tmp/hero-top.png' });

// Scroll into the pinned scrub a few times.
const sigs = [top];
for (const y of [600, 1400, 2400, 3400]) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(900);
  sigs.push(await canvasSignature());
}
await page.screenshot({ path: '/tmp/hero-scrolled.png' });

const distinct = new Set(sigs.map((s) => s && s.sum)).size;
const painted = top && top.nonBlack > 50;

console.log('canvas signatures:', JSON.stringify(sigs));
console.log('distinct frames while scrolling:', distinct, '/', sigs.length);
console.log('hero painted (not blank):', painted);
console.log('console/page errors:', errors.length ? errors : 'none');

await browser.close();

if (!painted) { console.error('FAIL: canvas appears blank'); process.exit(1); }
if (distinct < 3) { console.error('FAIL: frames did not advance with scroll'); process.exit(1); }
console.log('PASS: scroll-scrubbed hero is working');
