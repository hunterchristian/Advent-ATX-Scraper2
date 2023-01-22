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
    name: 'Austin Stone',
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
          OriginalURL: e.OriginalURL,
          Image: e.Image,
          IdealAudience: [],
        } as Partial<ChristianEvent>,
      } as AirtableInsertable),
  },
  {
    name: 'The Well Austin',
    url: 'https://thewellcommunitychurch.churchcenter.com/registrations',
    waitForSelector: 'a.card-list-item__wrapper-link',
    domQuery: `
        const els = document.querySelectorAll('a.card-list-item__wrapper-link');
        Array.from(els).map(el => ({
            Name: el.querySelector('h1').textContent,
            StartDate: el.querySelector('div.card-list-item__details') ? el.querySelector('div.card-list-item__details').textContent.split('–')[0] : null,
            EndDate: el.querySelector('div.card-list-item__details') ? el.querySelector('div.card-list-item__details').textContent.split('–')[1] : null,
            OriginalURL: el.href,
            Image: el.querySelector('img').src,
        }))
    `,
    formatter: (e: any) => {
      const startDate = e.StartDate
        ? moment(e.StartDate.trim(), 'MMMM D').format('YYYY-MM-DD')
        : '';

      let endDate = e.EndDate;
      if (endDate && endDate.indexOf(',') < 3) {
        // endDate is in the same month as startDate, e.g. January 20-22, 2023
        endDate = moment(
          `${startDate.split(' ')[0].trim()} ${endDate.trim()}`,
          'MMMM D, YYYY',
        ).format('YYYY-MM-DD');
      } else if (e.EndDate) {
        // endDate is in the form of January 22, 2023
        endDate = moment(endDate.trim(), 'MMMM D, YYYY').format('YYYY-MM-DD');
      }

      return {
        fields: {
          Name: e.Name,
          StartDate: startDate ? startDate : null,
          EndDate: endDate ? endDate : null,
          StartTime: null,
          EndTime: null,
          Location: '',
          Description: '',
          Cost: 0,
          EventHost: 'The Well Austin',
          OriginalURL: e.OriginalURL,
          Image: e.Image,
          IdealAudience: [],
        } as Partial<ChristianEvent>,
      } as AirtableInsertable;
    },
  },
];

export default EVENT_HOSTS;
