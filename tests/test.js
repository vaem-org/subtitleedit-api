import test from 'node:test';
import assert from 'node:assert';
import axios from 'axios';
import { createReadStream } from 'fs';
import { basename, join } from 'path';
import { config } from '#src/config';
import { fileURLToPath, URL } from 'url';

test('It should convert Subrip to Webvtt', async () => {
  const filename = join(fileURLToPath(new URL('.', import.meta.url)), 'test.srt');
  const { data } = await axios.post(`http://localhost:${config.port}/${basename(filename)}`,
    createReadStream(filename),
    {
      headers: {
        authorization: `Bearer ${config.apiKey}`
      }
    });

  assert.match(data, /about food and diet/);
})
