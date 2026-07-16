import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();
export const crmUserDb = new Pool({
  host: process.env.DB_HOST_SCORE_USER,
  port: Number(process.env.DB_PORT_SCORE_USER),
  user: process.env.DB_USER_SCORE_USER,
  password: process.env.DB_PASS_SCORE_USER,
  database: process.env.DB_NAME_SCORE_USER,
});
