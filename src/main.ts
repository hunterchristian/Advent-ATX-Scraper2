import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import puppeteer from 'puppeteer';
import { insertData } from 'src/db/airtable';
import Insertable from './types/airtable/Insertable';
import EVENT_HOSTS from 'src/config/eventHosts';
import PubSub from './util/pubSub';
import { SlackWebhook } from './util/axiosInstances';
import { FieldSet, Record as AirtableRecord } from 'airtable';

PubSub.getInstance().subscribe('events:created', async (data) => {
  console.log('Posting to Slack...');

  let message = `${data.length} new events added to Kadosh site for ${data[0].fields.EventHost}.`;
  data.forEach((event: AirtableRecord<FieldSet>) => {
    message += `\nNew event: https://airtable.com/apphhKdSx7C8A6x1x/tbllgWR89CpH9EHKg/viwiPs5LjCTuSqwtI/${event.id}`;
  });

  try {
    await SlackWebhook.post('', {
      text: message,
    });
  } catch (err) {
    console.log(
      '\x1b[31m',
      `Error encountered while posting events to Airtable\n${
        (err as any).message
      }\n${(err as any).response.statusText}\n${
        (err as any).response.data.error.type
      }\n${(err as any).response.data.error.message}`,
    );
    return;
  }

  console.log('Slack message posted.');
});

const scrapeEventHosts = async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    await Promise.all(
      EVENT_HOSTS.map(async (eventHost) => {
        console.log(`Navigating to ${eventHost.url}...`);

        const page = await browser.newPage();
        await page.goto(eventHost.url);

        await page.content();

        console.log('Querying web page DOM for events...');
        const events = await page.evaluate(eventHost.domQuery);
        console.log(`${events.length} events detected in DOM.`);

        console.log('Formatting event data...');
        const formattedEventData: Insertable[] = events.map((e: any) =>
          eventHost.formatter(e),
        );
        console.log('Event data formatted.');

        console.log('Uploading event data to Airtable...');
        await insertData(formattedEventData);
      }),
    );
  } catch (err) {
  } finally {
    console.log('Closing browser.');
    await browser.close();
  }
};

scrapeEventHosts();
