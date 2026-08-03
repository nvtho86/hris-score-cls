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

export const getLevelId = (hrisName: string): number | undefined => {
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
    const levelId = await getLevelId(emp.Level);
    const statusId = emp.IsResigsned === false ? 1 : 2;
    const sql = `
            INSERT INTO "user"
            (
                email,
                provider,
                full_name,
                level_id,
                department_id,
                branch_id,
                created_at,
                updated_at,
                "statusId",
                manager_id,
                first_name,
                last_name,
                official_code,
                engineer_code
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                NOW(),
                NOW(),
                $7,
                $8,
                $9,
                $10,
                $11,
                $12
            )
            ON CONFLICT (email)
            DO UPDATE SET
                provider = EXCLUDED.provider,
                full_name = EXCLUDED.full_name,
                level_id = EXCLUDED.level_id,
                department_id = EXCLUDED.department_id,
                branch_id = EXCLUDED.branch_id,
                updated_at = NOW(),
                "statusId" = EXCLUDED."statusId",
                manager_id = EXCLUDED.manager_id,
                first_name = EXCLUDED.first_name,
                last_name = EXCLUDED.last_name,
                official_code = EXCLUDED.official_code,
                engineer_code = EXCLUDED.engineer_code;
            `;
    const params = [
            emp.Email,
            'hr',
            emp.FullName,
            levelId,
            department,
            branch,
            statusId,
            managerId ?? null,
            firstName,
            lastName,
            emp.Code,
            emp.Code,
        ];
        params.forEach((v, i) => {
            console.log(i + 1, v, typeof v);
        });

        if(emp.Email){
            await crmDb.query(sql, params);
        }
            

    console.log(`User synced: ${emp.Code}`);
}
