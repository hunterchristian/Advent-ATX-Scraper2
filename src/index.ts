import fs from 'fs';
import puppeteer from 'puppeteer';

//Your URL here
const url = 'https://www.hcbc.com/events/';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.goto(url);

  await page.content();
  const events = await page.evaluate(`
      const els = document.querySelectorAll('textarea[name="fld_event_details"]');
      Array.from(els).map(e => JSON.parse(e.innerHTML));
    `);

  await fs.writeFileSync('data.json', JSON.stringify(events, null, 2));

  await browser.close();
})();
