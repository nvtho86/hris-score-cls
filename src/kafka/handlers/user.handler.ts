import { crmDb } from '../../database/crm.db';

export async function handleUser(event: any) {

    const emp = event.payload;
    await crmDb.query(
        `
        INSERT INTO "user"
        (
            email,
            provider,
            full_name,
            job_title_id,
            level_id,
            department_id,
            branch_id,
            created_at,
            updated_at,
            status_id,
            manager_id,
            first_name,
            last_name,
            official_code,
            engineer_code
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,
            NOW(),NOW(),
            $8,$9,$10,$11,$12,$13
        )
        ON CONFLICT (email)
        DO UPDATE SET
            email = EXCLUDED.email,
            provider = EXCLUDED.provider,
            full_name = EXCLUDED.full_name,
            job_title_id = EXCLUDED.job_title_id,
            level_id = EXCLUDED.level_id,
            department_id = EXCLUDED.department_id,
            branch_id = EXCLUDED.branch_id,
            created_at = NOW(),
            updated_at = NOW(),
            status_id = EXCLUDED.status_id,
            manager_id = EXCLUDED.manager_id,
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            official_code = EXCLUDED.official_code,
            engineer_code = EXCLUDED.engineer_code
        `,
        [
            emp.Email,      // $1
            'hr',           // $2
            emp.FullName,   // $3
            63,             // $4
            15,             // $5
            13,             // $6
            1,              // $7
            1,              // $8
            1451,           // $9
            emp.FullName,   // $10
            emp.FullName,   // $11
            emp.Code,       // $12
            emp.Code        // $13
        ],
    );

    console.log(`User synced: ${emp.Code}`);
}
