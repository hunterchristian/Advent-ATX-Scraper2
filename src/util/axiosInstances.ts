import axios, { AxiosInstance } from 'axios';

if (!process.env.AIRTABLE_API_KEY) {
  console.error(`process.env.AIRTABLE_API_KEY must be defined`);
  process.exit(1);
}

export const KadoshAirtable: AxiosInstance = axios.create({
  baseURL: 'https://api.airtable.com/v0/apphhKdSx7C8A6x1x',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
  },
});

if (!process.env.SLACK_WEBHOOK_URL) {
  console.log('process.env.SLACK_WEBHOOK_URL required');
  process.exit(1);
}
export const SlackWebhook: AxiosInstance = axios.create({
  baseURL: process.env.SLACK_WEBHOOK_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
