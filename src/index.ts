import express from 'express';
import { createWriteStream } from 'fs';
import { join } from 'path';

if (!process.env.PORT) {
  throw new Error(
    'Please specify the port number for the HTTP server with the environment variable PORT.',
  );
}

const { PORT } = process.env;

const storagePath = join(__dirname, '../storage');
console.log(`Storing files at ${storagePath}.`);

const app = express();

//
// HTTP GET route that streams a video from storage.
//
app.get('/video', (req, res) => {
  const videoId = req.query.id as string;
  const localFilePath = join(storagePath, videoId);
  res.sendFile(localFilePath);
});

//
// HTTP POST route to upload a video to storage.
//
app.post('/upload', (req, res) => {
  console.log('Uploading video... Mockstorage!');
  const videoId = req.headers.id as string;
  const localFilePath = join(storagePath, videoId);
  const fileWriteStream = createWriteStream(localFilePath);
  req
    .pipe(fileWriteStream)
    .on('error', (err) => {
      console.error('Upload failed.');
      console.error((err && err.stack) || err);
    })
    .on('finish', () => {
      res.sendStatus(200);
    });
});

app.listen(PORT, () => {
  console.log(`Microservice online ${PORT}`);
});
