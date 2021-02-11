import pg from 'pg';
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';

const { Client } = pg;

dotenv.config();


const {
  DATABASE_URL: connectionString,
} = process.env;

if (!connectionString) {
  console.error('Vantar DATABASE_URL');
  process.exit(1);
}



export async function insert(data) {
  const q = `
INSERT INTO signatures
(name, nationalId, comment, anonymous)
VALUES
($1, $2, $3, $4)`;
  const values = [data.name, data.nationalId, data.comment, data.anonymous];

  return query(q, values);
}


async function query(q, values=[]) {
  const client = new Client({ connectionString });

  await client.connect();

  const data = await client.query(q, values);
  const { rows } = data;
  await client.end()

  return rows;

}


export async function initialize() {

  try {
    const createTable = await readFile('./sql/schema.sql');
    await query(createTable.toString('utf8'));
    console.info('Table made');
  } catch(e) {
    console.error(e.message);
    return;
  }

    try {
      const insert = await readFile('./sql/fake.sql');
      await query(insert.toString('utf8'));
      console.info('Data added');
    } catch (e) {
      console.error(e.message);
    }

};

const pool = new pg.Pool({ connectionString });

export async function select() {
  const client = await pool.connect();

  try {
    const res = await client.query('SELECT * FROM signatures');
    return res.rows;
  } catch (e) {
    console.error('Error selecting', e);
  } finally {
    client.release();
  }
  return [];
}

