export interface StaffEvent {

  eventId: string;

  eventType: string;

  source: string;

  occurredAt: string;

  payload: {

    id: string;

    code: string;

    full_name: string;

    branch: string;

    department: string;

    team: string;

    job_title: string;

    level: string;

    manager_code: string;

    manager_name: string;

    start_date: Date;

    end_date: Date;

    email: string;

    created_at: Date;

    updated_at: Date;

    modified_date: Date;
  };
}