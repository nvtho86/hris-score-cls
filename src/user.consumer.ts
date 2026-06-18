import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { BaseEvent } from './events/base-event.interface';
import type { UserPayload } from './events/user.event';

@Controller()
export class UserConsumer {
  @MessagePattern('hris.user.updated')
  async handleStaffUpdated(
    @Payload() event: BaseEvent<UserPayload>,
  ) {
    // 1️⃣ Multi-tenant filter
    if (!this.isTenantAllowed(event.tenant_id)) return;

    // 2️⃣ Idempotent check
    if (await this.isProcessed(event.event_id)) return;

    // 3️⃣ Upsert projection DB
    await this.upsertUser(event);

    // 4️⃣ Mark processed
    await this.markProcessed(event.event_id);
  }

  private isTenantAllowed(tenantId: string): boolean {
    return true; // check theo context
  }

  private async isProcessed(eventId: string): Promise<boolean> {
    return false; // query bảng processed_events
  }

  private async markProcessed(eventId: string) {
    // insert processed_events
  }

  private async upsertUser(event: BaseEvent<UserPayload>) {
    // upsert staff projection
  }
}
