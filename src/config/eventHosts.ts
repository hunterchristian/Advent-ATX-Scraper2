import moment from 'moment';
import ChristianEvent from 'src/types/airtable/Event';
import AirtableInsertable from 'src/types/airtable/Insertable';
import decodeEntities from 'src/util/decodeEntities';
import removeTags from 'src/util/removeTags';

const EVENT_HOSTS = [
  {
    name: 'Hill Country Bible Church',
    url: 'https://www.hcbc.com/events',
    domQuery: `
        const els = document.querySelectorAll('textarea[name="fld_event_details"]');
        Array.from(els).map(e => JSON.parse(e.innerHTML));
    `,
    formatter: (e: any) =>
      ({
        fields: {
          Name: e.title,
          StartDate: moment(e.date, 'MMMM, DD YYYY, hh:mm:ss').format(
            'YYYY-MM-DD',
          ),
          EndDate: moment(e.date, 'MMMM, DD YYYY, hh:mm:ss').format(
            'YYYY-MM-DD',
          ),
          StartTime: moment(e.start, 'h:mm A').toISOString(),
          EndTime: moment(e.end, ' - h:mm A').toISOString(),
          Location: e.location,
          Description: removeTags(decodeEntities(e.description))
            .replace('\r\n', '')
            .trim(),
          Cost: 0,
          EventHost: 'Hill Country Bible Church',
          OriginalURL: `https://www.hcbc.com/events?event_id=${e.id}`,
          Image:
            'https://www.hcbc.com' + e.style.substring(23, e.style.length - 3),
          IdealAudience: [],
        } as ChristianEvent,
      } as AirtableInsertable),
  },
  {
    name: 'Austin Stonw',
    url: 'https://www.austinstone.org/get-involved#classes-events',
    domQuery: `
        const els = document.querySelectorAll('div[aria-labelledby="classes-events"] a.collection-item-container---link:not(.w-condition-invisible)');
        Array.from(els).map(el => ({
            Name: el.querySelector('h4[fs-cmsfilter-field="Title"]').textContent,
            StartDate: el.querySelector('h6[fs-cmsfilter-field="Start-Date"]').textContent,
            EndDate: el.querySelector('h6[fs-cmsfilter-field="End-Date"]').textContent,
            OriginalURL: el.href,
            Image: el.querySelector('img').src,
        }))
    `,
    formatter: (e: any) =>
      ({
        fields: {
          Name: e.Name,
          StartDate: moment(e.StartDate, 'M.DD.YY').format('YYYY-MM-DD'),
          EndDate: moment(e.EndDate, 'M.DD.YY').format('YYYY-MM-DD'),
          StartTime: null,
          EndTime: null,
          Location: '',
          Description: '',
          Cost: 0,
          EventHost: 'Austin Stone',
          OriginalURL: e.href,
          Image: e.Image,
          IdealAudience: [],
        } as Partial<ChristianEvent>,
      } as AirtableInsertable),
  },
];

export default EVENT_HOSTS;
