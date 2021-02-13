import pg from 'pg';
import dotenv from 'dotenv';

const { Client } = pg;

dotenv.config();

const {
  DATABASE_URL: connectionString,
  Node_ENV: nodeEnv = 'development',
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

export async function insert(data) {
  const q = `
INSERT INTO signatures
(name, nationalId, comment, anonymous)
VALUES
($1, $2, $3, $4)`;
  const values = [data.name, data.nationalId, data.comment, data.anonymous];

  return query(q, values);
}

const ssl = nodeEnv !== 'development' ? { rejectUnauthorized: false } : false;
const pool = new pg.Pool({ connectionString, ssl });

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
