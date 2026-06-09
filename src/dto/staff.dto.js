export interface StaffDto {

  id: string;

  code: string;

  fullName: string;

  branch: string;

  department: string;

  team: string;

  jobTitle: string;

  level: string;

  managerCode: string;

  managerName: string;

  startDate: string;

  endDate?: string;

  email: string;
}