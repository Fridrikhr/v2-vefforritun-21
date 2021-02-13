import { readFile } from 'fs/promises';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Client } = pg;

const {
  DATABASE_URL: connectionString,
} = process.env;

if (!connectionString) {
  console.error('Vantar DATABASE_URL');
  process.exit(1);
}

async function query(q, values = []) {
  const client = new Client({ connectionString });

  await client.connect();

  const data = await client.query(q, values);
  const { rows } = data;
  await client.end();
  return rows;
}

export async function initialize() {
  try {
    const createTable = await readFile('./sql/schema.sql');
    await query(createTable.toString('utf8'));
    console.info('Table made');
  } catch (e) {
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
}

initialize().catch((err) => {
  console.error(err);
});
