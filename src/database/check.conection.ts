import { Pool } from 'pg';

export async function checkConnection(pool: Pool, dbName: string) {
  try {
    const client = await pool.connect();

    await client.query('SELECT 1');

    console.log(`✅ ${dbName} Connected`);

    client.release();
  } catch (err) {
    console.error(`❌ ${dbName} Connection Failed`);
    console.error(err.message);
    process.exit(1);
  }
}