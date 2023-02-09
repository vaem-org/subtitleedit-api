import axios from 'axios';
import { createReadStream } from 'fs';
import { basename } from 'path';
import { config } from '#src/config';

const filename = process.argv[2];
const { data } = await axios.post(`http://localhost:5000/${basename(filename)}`, createReadStream(filename), {
  headers: {
    authorization: `Bearer ${config.apiKey}`
  }
});

console.log(data);
