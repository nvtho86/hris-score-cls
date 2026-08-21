import { crmUserDb } from '../../database/crm_user.db';
import { checkConnection } from '../../database/check.conection';

export async function getManagerId(managerCode: string): Promise<number | null> {
    if (!managerCode) return null;


  await checkConnection(crmUserDb, 'CRM USER DB');
  if (!managerCode) {
    return null;
  }
  const queryUser = `
      SELECT u.id
      FROM "user" u
      WHERE u.engineer_code = $1
      LIMIT 1
    `
  const result = await crmUserDb.query(queryUser, [managerCode]);
  if (result.rowCount === 0) {
    console.warn(`⚠ Manager ${managerCode} chưa tồn tại.`);
    return null;
  }
  console.log("===========================")
  console.log('manager_id', result.rows.length > 0 ? result.rows[0].id : null)
  console.log("===========================")
  
  return result.rowCount > 0 ? result.rows[0].id : null;
}
