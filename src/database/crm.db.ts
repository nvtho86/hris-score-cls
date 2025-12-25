import { Pool } from 'pg';

export const crmDb = new Pool({
  host: '192.168.37.11',
  port: 30100,
  user: 'postgres',
  password: 'postgres',
  database: 'crm_score',
});


// CREATE TABLE employees_projection (
//   employee_id VARCHAR(50) PRIMARY KEY,
//   email TEXT,
//   full_name TEXT,
//   status TEXT,
//   synced_at TIMESTAMP
// );
