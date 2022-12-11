import Event from './Event';

interface AirtableRecord {
  id: string;
  createdTime: string;
  fields: Event;
}

export default AirtableRecord;
