/*
 * VAEM - Asset manager
 * Copyright (C) 2026  Wouter van de Molengraft
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import test from 'node:test'
import assert from 'node:assert'
import { createReadStream } from 'fs'
import { basename, join } from 'path'
import { config } from '#src/config'
import { fileURLToPath, URL } from 'url'

test('It should convert Subrip to Webvtt', async () => {
  const filename = join(fileURLToPath(new URL('.', import.meta.url)), 'test.srt')
  const data = await (await fetch(`http://localhost:${config.port}/${basename(filename)}`,
    {
      method: 'POST',
      duplex: 'half',
      body: createReadStream(filename),
      headers: {
        authorization: `Bearer ${config.apiKey}`,
      },
    })
  ).text()
  assert.match(data, /about food and diet/)
})
