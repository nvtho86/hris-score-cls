import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LmsService {
  private getFirstName(fullName: string): string {
    if (!fullName) return '';
    const arr = fullName.trim().split(/\s+/);
    return arr[arr.length - 1];
  }

  private getLastName(fullName: string): string {
    if (!fullName) return '';
    const arr = fullName.trim().split(/\s+/);
    arr.pop();
    return arr.join(' ');
  }
  private getUsernameFromEmail(email: string): string {
    if (!email) return '';
    const atIndex = email.indexOf('@');
    return atIndex > -1
        ? email.substring(0, atIndex)
        : email;
  }
  private buildOrg(payload: any) {
    const branch = payload.Branch?.trim().toUpperCase();
    const department = payload.Department?.trim().toUpperCase();
    const team = payload.Team?.trim().toUpperCase();

    const orgCode = [branch, department, team]
      .filter((x): x is string => !!x)
      .join('_');

    const parentOrgCode = team
      ? [branch, department]
          .filter((x): x is string => !!x)
          .join('_')
      : branch;

    return {
      orgName: team || department,
      titleName: payload.JobTitle || '',
      orgCode,
      parentOrgCode,
    };
  }
  async upsertUser(payload: any) {
    try {
      const org = this.buildOrg(payload);
      const clsPayload = {
        secretKey: '4ad8g95ba4b98ac37a1c71a74sa9a67a',
        datas: [
          {

            email: payload.Email,
            firstName: this.getFirstName(payload.FullName),
            lastName: this.getLastName(payload.FullName),
            code: payload.Code,
            userName: this.getUsernameFromEmail(payload.Email),
            gender: true,
            phoneNumber: payload.Phone || '',
            userType: 'Học viên',
            orgs: [
                    {
                orgName: org.orgName,
                orgCode: org.orgCode,
                parentOrgCode: org.parentOrgCode,
              },
            ],
            groups: ['9382'], // Onboarding
            statusId: 0,
            createdDate: new Date().toISOString(),
          },
        ],
      };

      console.log(
        '➡️ LMS Request:',
        JSON.stringify(clsPayload, null, 2),
      );

      const response = await axios.post(
        'https://eapiv4.cloudlms.top/api/HRM/user/add-list',
        clsPayload,
      );

      console.log('✅ LMS Response:', response.data);

      return response.data;
    } catch (error) {
      console.error(
        '❌ LMS Error:',
        error.response?.data || error.message,
      );

      throw error;
    }
  }
}