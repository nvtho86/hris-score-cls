import { Pool } from 'pg';

export const crmDb = new Pool({
  // host: '192.168.37.11',
  // port: 30100,
  // user: 'postgres',
  // password: 'postgres',
  // database: 'crm_score',
  host: process.env.DB_HOST_SCORE,
  port: process.env.DB_PORT_SCORE,
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
