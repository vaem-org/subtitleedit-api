import { spawn } from 'child_process';
import express from 'express';
import { createWriteStream } from 'fs';
import { unlink, readFile } from 'fs/promises';
import { config } from '#src/config';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';

const app = express();

if (!config.apiKey) {
  throw new Error('No API_KEY environment variable defined');
}

const wrap = handler => (req, res, next) => {
  handler(req, res, next)
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
};

app.use(({ headers: { authorization='' } }, res, next) => {
  if (authorization.toLowerCase() !== `bearer ${config.apiKey}`) {
    res.status(401).end();
  } else {
    next();
  }
});

app.post('/:filename.:extension', wrap(async (req, res) => {
  const { extension } = req.params;
  const tempFile = join(tmpdir(), `${randomBytes(4).toString('hex')}.${extension}`);

  req.pipe(createWriteStream(tempFile));
  await new Promise((resolve, reject) => {
    req.on('close', resolve);
    req.on('error', reject);
  });

  const child = spawn('xvfb-run', [
    '-a',
    'mono',
    '/opt/subtitleedit/SubtitleEdit.exe',
    '/convert', tempFile, 'webvtt',
    '/encoding:utf-8'
  ], {
    stdio: 'pipe'
  });

  const stdout = [];

  child.stdout.on('data', buf => stdout.push(buf));

  const code = await new Promise((resolve) => {
    child.on('close', resolve);
  });

  await unlink(tempFile);

  const output = Buffer.concat(stdout).toString();
  if (code !== 0) {
    res.status(500).send(output);

    return;
  }

  const vttTempFile = tempFile.replace(/\.[^.]+$/, '.vtt');
  const data = await readFile(vttTempFile);
  await unlink(vttTempFile);

  res.send(data);
}));

app.listen(config.port, () => {
  console.log(`Server listening on http://0.0.0.0:${config.port}`);
})
