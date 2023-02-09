import axios from 'axios';
import { createReadStream } from 'fs';
import { basename } from 'path';
import { config } from '#src/config';

const filename = process.argv[2];
try {
  const { data } = await axios.post(`http://localhost:${config.port}/${basename(filename)}`,
    createReadStream(filename),
    {
      headers: {
        authorization: `Bearer ${config.apiKey}`
      }
    });
  console.log(data);
}
catch (e) {
  console.error(e.response?.data ?? e);
}
