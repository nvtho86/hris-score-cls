import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();
export const crmDb = new Pool({
  host: process.env.DB_HOST_SCORE,
  port: Number(process.env.DB_PORT_SCORE),
  user: process.env.DB_USER_SCORE,
  password: process.env.DB_PASS_SCORE,
  database: process.env.DB_NAME_SCORE,
});


// CREATE TABLE employees_projection (
//   employee_id VARCHAR(50) PRIMARY KEY,
//   email TEXT,
//   full_name TEXT,
//   status TEXT,
//   synced_at TIMESTAMP
// );
