export interface BaseEvent<T> {
  event_id: string;
  event_type: string;
  source: 'HRIS' | 'CRM' | 'LMS';
  tenant_id: string;
  occurred_at: string;
  payload: T;
}
