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




// CREATE EXTENSION IF NOT EXISTS pgcrypto;

// CREATE TABLE staff (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     code VARCHAR(50) NOT NULL UNIQUE,
//     full_name VARCHAR(250) NOT NULL,
//     branch VARCHAR(250),
//     department VARCHAR(250),
//     team VARCHAR(250),
//     job_title VARCHAR(250),
//     level VARCHAR(250),
//     manager_code VARCHAR(50),
//     manager_name VARCHAR(250),
//     start_date TIMESTAMP,
//     end_date TIMESTAMP,
//     email VARCHAR(100),
//     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );