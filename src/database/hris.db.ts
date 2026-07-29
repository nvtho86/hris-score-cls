import * as sql from 'mssql';
import * as dotenv from 'dotenv';

export const hrisDb = new sql.ConnectionPool({
    user: process.env.DB_USER_HRIS,
    password: process.env.DB_PASS_HRIS,
    server: process.env.DB_HOST_HRIS,
    database: process.env.DB_NAME_HRIS,
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
});


// CREATE TABLE employees_sync (
//   employee_id VARCHAR(50) PRIMARY KEY,
//   email VARCHAR(100),
//   full_name NVARCHAR(200),
//   status VARCHAR(20),
//   updated_at DATETIME
// );
