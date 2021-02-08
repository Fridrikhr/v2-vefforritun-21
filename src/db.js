import pg from 'pg';
import dotenv from 'dotenv';

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
INSERT INTO applications
(named, id, remark, noName)
VALUES
($1, $2, $3, $4)`;
  const values = [data.named, data.id, data.remark, data.noName];

  return query(q, values);
}
