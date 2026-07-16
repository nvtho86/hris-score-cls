import { crmUserDb } from '../../database/crm_user.db';

export async function getManagerId(
  managerCode: string,
): Promise<string | null> {
  if (!managerCode) {
    return null;
  }

  const result = await crmUserDb.query(
    `
      SELECT uth.id
      FROM "user" u
      left join user_transaction_history uth on uth.user_id = u.id 
      WHERE u.engineer_code = $1
      LIMIT 1
    `,
    [managerCode],
  );
  console.log("===========================")
  console.log(result)
  console.log("===========================")
  return result.rows.length > 0 ? result.rows[0].id : null;
}