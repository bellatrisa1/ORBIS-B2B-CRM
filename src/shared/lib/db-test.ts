import { pool } from './db';

export async function testDatabaseConnection() {
  const result = await pool.query('SELECT NOW() as now');
  return result.rows[0];
}
