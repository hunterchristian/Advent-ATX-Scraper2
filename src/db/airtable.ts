import ChristianEvent from '../types/airtable/Event';
import generateDataSlice from 'src/util/generateDataSlice';
import Insertable from 'src/types/airtable/Insertable';
import Airtable, { FieldSet, Record as AirtableRecord } from 'airtable';
import PubSub from 'src/util/pubSub';
import { KadoshAirtable } from 'src/util/axiosInstances';
import { reject } from 'lodash';

Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
const base = Airtable.base('apphhKdSx7C8A6x1x');
const table = base('tbllgWR89CpH9EHKg');

const getKey = (event: ChristianEvent) =>
  `${event.EventHost}_${event.Name}_${event.StartDate}`;

const insertDataSlice = async (data: ChristianEvent[]) =>
  new Promise<AirtableRecord<FieldSet>[]>(async (resolve, reject) => {
    console.log('Inserting data slice...');

    let response;
    try {
      response = await KadoshAirtable.post('/Events', {
        records: data,
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

      reject('Failed to upload events to Airtable');
      return;
    }

    console.log('Data slice inserted.');

    resolve(response.data.records);
  });

export const insertData = async (data: Insertable[]) =>
  new Promise<void>(async (resolve) => {
    console.log('Fetching all events from Airtable...');
    const allEvents = await table.select().all();
    console.log(`${allEvents.length} events fetched.`);

    console.log(
      'Creating map of events to detect events which already exist in Airtable...',
    );
    const eventsMap = allEvents.reduce(
      (
        acc: Record<string, AirtableRecord<FieldSet>>,
        curr: AirtableRecord<FieldSet>,
      ) => {
        const key = getKey(curr.fields as unknown as ChristianEvent);
        acc[key] = curr;

        return acc;
      },
      {},
    );
    console.log('Event map created.');

    console.log('Removing existing events from scraped data...');
    const recordsToInsert = data.filter(
      (e) => !eventsMap[getKey(e.fields as ChristianEvent)],
    );
    console.log(
      `${
        data.length - recordsToInsert.length
      } existing events removed from scraped data.`,
    );

    if (recordsToInsert.length === 0) {
      console.log('No new events detected.');
      resolve();
      return;
    }

    console.log(`inserting ${recordsToInsert.length} events into Airtable...`);

    let allCreatedEvents: AirtableRecord<FieldSet>[] = [];
    for (const dataSlice of generateDataSlice(recordsToInsert)) {
      const createdEvents = await insertDataSlice(dataSlice);
      allCreatedEvents = [...allCreatedEvents, ...createdEvents];
    }
    console.log(`${allCreatedEvents.length} events inserted.`);

    PubSub.getInstance().publish('events:created', allCreatedEvents);

    resolve();
  });
