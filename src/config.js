import 'dotenv/config';

export const config = {
  port: process.env.PORT ?? 5000,
  apiKey: process.env.API_KEY
}
