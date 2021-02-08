import express from 'express';
import dotenv from 'dotenv';
import { router } from './registration.js';


dotenv.config();

const {
  PORT: port = 3000,
} = process.env;

const app = express();

app.set('views', './views');
app.set('view engine', 'ejs');

app.use('/', router);

// TODO setja upp rest af virkni!

// Verðum að setja bara *port* svo virki á heroku
app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
