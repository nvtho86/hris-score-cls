export interface BaseEvent<T> {
  event_id: string;
  event_type: string;
  event_version: 'v1';
  tenant_id: string;
  source_system: 'HRIS' | 'CRM' | 'LMS';
  occurred_at: string;
  trace_id: string;
  data: T;
}
