import express from 'express';
import dotenv from 'dotenv';
import { router } from './registration.js';
import { initialize } from './db.js';


dotenv.config();

const {
  PORT: port = 3000,
} = process.env;

const app = express();

app.use(express.static('./public'));

app.set('views', './views');
app.set('view engine', 'ejs');


initialize().catch((err) => {
  console.error(err);
});


app.use('/', router);


// Verðum að setja bara *port* svo virki á heroku
app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
