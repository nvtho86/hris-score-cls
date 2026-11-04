import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { BaseEvent } from './events/base-event.interface';
import type { RoutePayload } from './events/route.event';

@Controller()
export class RouteConsumer {
  @MessagePattern('hris.route.updated')
  async handleStaffUpdated(
    @Payload() event: BaseEvent<RoutePayload>,
  ) {
    // 1️⃣ Multi-tenant filter
    if (!this.isTenantAllowed(event.tenant_id)) return;

    // 2️⃣ Idempotent check
    if (await this.isProcessed(event.event_id)) return;

    // 3️⃣ Upsert projection DB
    await this.upsertRoute(event);

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

  private async upsertRoute(event: BaseEvent<RoutePayload>) {
    // upsert staff projection
  }
}
