import { crmUserDb } from '../../database/crm_user.db';

export async function getManagerId(
  managerCode: string,
): Promise<string | null> {

  if (!managerCode) {
    return null;
  }
  const queryUser = `
      SELECT uth.id
      FROM "user" u
      left join user_transaction_history uth on uth.user_id = u.id 
      WHERE u.engineer_code = $1
      LIMIT 1
    `
  const result = await crmUserDb.query(queryUser, [managerCode]);
  // console.log("===========================")
  // console.log(result.rows[0].id)
  // console.log("===========================")
  return result.rows.length > 0 ? result.rows[0].id : null;
}