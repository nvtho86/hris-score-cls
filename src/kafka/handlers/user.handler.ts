import { crmDb } from '../../database/crm.db';
import { BRANCH_MAPPING } from '../../constants/branch';
import { DEPARTMENT_MAPPING } from '../../constants/department';
import { LEVEL_MAPPING } from '../../constants/level';
import { getManagerId } from './manager.handler';

export const getBranchId = (hrisId: string): number | undefined => {
return BRANCH_MAPPING.find(item => item.hrisId === hrisId)?.scoreId;
};

export const getDepartmentId = (hrisId: string): number | undefined => {
return DEPARTMENT_MAPPING.find(item => item.hrisId === hrisId)?.scoreId;
};

export const getLevelName = (hrisName: string): number | undefined => {
return LEVEL_MAPPING.find(item => item.hrisName === hrisName)?.scoreId;
};

export async function handleUser(event: any) {

    const emp = event.payload;
    const parts = emp.FullName.trim().split(/\s+/);
    const lastName = parts.shift() || '';
    const firstName = parts.join(' ');
    const branch = getBranchId(emp.Branch);
    const department = getDepartmentId(emp.Department);
    const managerId = await getManagerId(emp.ManagerCode);
    const levelId = await getLevelName(emp.Level);
    
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
            emp.Email,      // $1 email
            'hr',           // $2 provider
            emp.FullName,   // $3 full_name
            63,             // $4 job_title_id
            levelId,        // $5 level_id
            department,     // $6 department_id
            branch,         // $7 branch_id
            1,              // $8 status_id
            managerId,      // $9 manager_id
            firstName,      // $10 first_name
            lastName,       // $11 last_name
            emp.Code,       // $12 official_code
            emp.Code        // $13 engineer_code
        ],
    );

    console.log(`User synced: ${emp.Code}`);
}
