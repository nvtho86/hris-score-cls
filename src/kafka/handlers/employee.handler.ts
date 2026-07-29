import { crmDb } from '../../database/crm.db';

export async function handleEmployee(event: any) {

    const emp = event.payload;

    await crmDb.query(
        `
        INSERT INTO employees_projection
        (
            employee_id,
            email,
            full_name,
            status,
            synced_at
        )
        VALUES
        (
            $1,$2,$3,$4,now()
        )
        ON CONFLICT (employee_id)
        DO UPDATE SET
            email = EXCLUDED.email,
            full_name = EXCLUDED.full_name,
            status = EXCLUDED.status,
            synced_at = now()
        `,
        [
            emp.employee_id,
            emp.email,
            emp.full_name,
            emp.status,
        ],
    );

    console.log(`Employee synced: ${emp.employee_id}`);
}