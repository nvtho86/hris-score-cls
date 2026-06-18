import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import { BaseEvent } from './events/base-event.interface';
import { EmployeePayload } from './events/employee-old.event';
import { StaffPayload } from './events/staff.event';
import { UserPayload } from './events/user.event';

@Injectable()
export class HrisEventPublisher {
  constructor(
    @Inject('KAFKA_CLIENT')
    private readonly kafka: ClientKafka,
  ) {}

  async employeeUpdated(employee: EmployeePayload, tenantId: string) {
    const event: BaseEvent<EmployeePayload> = {
      event_id: randomUUID(),
      event_type: 'EMPLOYEE_UPDATED',
      event_version: 'v1',
      tenant_id: tenantId,
      source_system: 'HRIS',
      occurred_at: new Date().toISOString(),
      trace_id: randomUUID(),
      data: employee,
    };

    this.kafka.emit('hris.employee.updated', {
      key: tenantId,
      value: event,
    });
  }

  async staffUpdated(staff: StaffPayload, tenantId: string) {
    const event: BaseEvent<StaffPayload> = {
      event_id: randomUUID(),
      event_type: 'STAFF_UPDATED',
      event_version: 'v1',
      tenant_id: tenantId,
      source_system: 'HRIS',
      occurred_at: new Date().toISOString(),
      trace_id: randomUUID(),
      data: staff,
    };

    this.kafka.emit('hris.staff.updated', {
      key: tenantId,
      value: event,
    });
  }

  async userUpdated(staff: UserPayload, tenantId: string) {
    const event: BaseEvent<UserPayload> = {
      event_id: randomUUID(),
      event_type: 'USER_UPDATED',
      event_version: 'v1',
      tenant_id: tenantId,
      source_system: 'HRIS',
      occurred_at: new Date().toISOString(),
      trace_id: randomUUID(),
      data: staff,
    };

    this.kafka.emit('hris.user.updated', {
      key: tenantId,
      value: event,
    });
  }
}
