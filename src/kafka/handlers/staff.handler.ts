import { crmDb } from '../../database/crm.db';

export async function handleStaff(event: any) {

    const emp = event.payload;
console.log('ssssssssssssssssss'+emp.Code)
    await crmDb.query(
        `
        INSERT INTO staff
        (
            code,
            full_name,
            branch,
            department,
            team,
            job_title,
            level,
            manager_code,
            manager_name,
            email,
            modified_date
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,now()
        )
        ON CONFLICT (code)
        DO UPDATE SET
            code = EXCLUDED.code,
            full_name = EXCLUDED.full_name,
            branch = EXCLUDED.branch,
            department = EXCLUDED.department,
            team = EXCLUDED.team,
            job_title = EXCLUDED.job_title,
            level = EXCLUDED.level,
            manager_code = EXCLUDED.manager_code,
            manager_name = EXCLUDED.manager_name,
            email = EXCLUDED.email,
            modified_date = now()
        `,
        [
            emp.Code,
            emp.FullName,
            emp.Branch,
            emp.Department,
            emp.Team,
            emp.JobTitle,
            emp.Level,
            emp.ManagerCode,
            emp.ManagerName,
            emp.Email,
        ],
    );

    console.log(`Staff synced: ${emp.Code}`);
}

// "ID": "C5B5D574-CC8A-47F2-958F-00D1DA40731E",
//     "Code": "Test10000010",
//     "FullName": "Nguyễn Văn J",
//     "Branch": "HCM",
//     "Department": "FIN",
//     "Team": "FIN",
//     "JobTitle": "Accountant",
//     "Level": "Junior",
//     "ManagerCode": "Test10000029",
//     "ManagerName": "Nguyễn Văn G1",
//     "StartDate": "2022-07-19T00:00:00.000Z",
//     "EndDate": null,
//     "Email": null,
//     "ModifiedDate": "2026-06-11T00:20:00.000Z"