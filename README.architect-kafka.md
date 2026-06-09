🎯 MỤC TIÊU DEMO

Integration Service (NestJS) sẽ làm 3 việc:

⏱️ Poll DB trung gian HRIS / CRM

📤 Emit Kafka event khi phát hiện thay đổi

📥 Consume Kafka → update DB trung gian khác / gọi LMS API

1️⃣ KIẾN TRÚC CODE (RẤT QUAN TRỌNG)
integration-service/
├── src/
│   ├── app.module.ts
│   ├── kafka/
│   │   ├── kafka.module.ts
│   │   ├── kafka.producer.ts
│   │   └── kafka.consumer.ts
│   ├── poller/
│   │   ├── hris.poller.ts
│   │   └── crm.poller.ts
│   ├── events/
│   │   ├── base-event.ts
│   │   └── employee.event.ts
│   ├── lms/
│   │   └── lms.service.ts
│   └── main.ts


👉 Đệ tử nhớ:

Poll DB ≠ Kafka

Kafka ≠ DB

Mỗi thứ 1 nhiệm vụ

2️⃣ CÀI PACKAGE (YARN – SƯ PHỤ KHÔNG QUÊN 😄)
yarn add @nestjs/microservices kafkajs
yarn add @nestjs/schedule
yarn add pg mssql

3️⃣ EVENT SCHEMA (CỐT LÕI)
src/events/base-event.ts
export interface BaseEvent<T> {
  event_id: string;
  event_type: string;
  source: 'HRIS' | 'CRM' | 'LMS';
  tenant_id: string;
  occurred_at: string;
  payload: T;
}

src/events/employee.event.ts
export interface EmployeePayload {
  employee_id: string;
  email: string;
  full_name: string;
  status: string;
}


👉 Event KHÔNG phụ thuộc DB schema

4️⃣ KAFKA PRODUCER
src/kafka/kafka.producer.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaProducer implements OnModuleInit {
  private producer;

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'integration-service',
      brokers: ['localhost:9092'],
    });

    this.producer = kafka.producer();
    await this.producer.connect();
  }

  async emit(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}

5️⃣ POLL DB TRUNG GIAN HRIS

👉 Ví dụ: MSSQL

src/poller/hris.poller.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { KafkaProducer } from '../kafka/kafka.producer';
import { v4 as uuid } from 'uuid';

@Injectable()
export class HrisPoller {
  constructor(private readonly producer: KafkaProducer) {}

  @Cron('*/30 * * * * *') // mỗi 30s
  async poll() {
    // giả lập query DB trung gian
    const changedEmployees = [
      {
        employee_id: 'E001',
        email: 'a@company.com',
        full_name: 'Nguyen Van A',
        status: 'ACTIVE',
      },
    ];

    for (const emp of changedEmployees) {
      await this.producer.emit('hris.employee.updated', {
        event_id: uuid(),
        event_type: 'EMPLOYEE_UPDATED',
        source: 'HRIS',
        tenant_id: 'tenant_01',
        occurred_at: new Date().toISOString(),
        payload: emp,
      });
    }
  }
}


👉 Sau này:

Thay changedEmployees bằng query DB

Có last_synced_at

6️⃣ KAFKA CONSUMER → UPDATE CRM + LMS
src/kafka/kafka.consumer.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { LmsService } from '../lms/lms.service';

@Injectable()
export class KafkaConsumer implements OnModuleInit {
  constructor(private readonly lmsService: LmsService) {}

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'integration-service',
      brokers: ['localhost:9092'],
    });

    const consumer = kafka.consumer({
      groupId: 'integration-group',
    });

    await consumer.connect();
    await consumer.subscribe({
      topic: 'hris.employee.updated',
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ message }) => {
        const event = JSON.parse(message.value.toString());

        // 1️⃣ Update DB trung gian CRM
        console.log('Update CRM DB:', event.payload);

        // 2️⃣ Call LMS API
        await this.lmsService.upsertUser(event.payload);
      },
    });
  }
}

7️⃣ LMS SERVICE (API ADAPTER)
src/lms/lms.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class LmsService {
  async upsertUser(payload: any) {
    console.log('Call LMS API:', payload);
    // axios.post('https://lms/api/users', payload)
  }
}

8️⃣ MODULE WIRING
src/app.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { KafkaProducer } from './kafka/kafka.producer';
import { KafkaConsumer } from './kafka/kafka.consumer';
import { HrisPoller } from './poller/hris.poller';
import { LmsService } from './lms/lms.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [
    KafkaProducer,
    KafkaConsumer,
    HrisPoller,
    LmsService,
  ],
})
export class AppModule {}

9️⃣ LUỒNG CHẠY THỰC TẾ (ĐỆ TỬ DEBUG THEO)

Integration Service start

HrisPoller chạy mỗi 30s

Emit hris.employee.updated

Kafka nhận message

Consumer xử lý:

Update DB trung gian CRM

Gọi LMS API

👉 KHÔNG hệ thống nào gọi chéo nhau

🔥 TẠI SAO DEMO NÀY ĐÚNG KIẾN TRÚC?

✅ Tôn trọng DB trung gian
✅ Kafka làm backbone
✅ Có thể rebuild
✅ Dễ mở rộng thêm ERP / BI
✅ Không phụ thuộc vendor

🚀 BÀI TIẾP THEO (RẤT NÊN)

Sư phụ có thể tiếp cho đệ tử:

✅ Idempotent + processed_events table

✅ Retry + DLQ

✅ Multi-tenant Kafka topic

✅ Flow rebuild CRM từ Kafka

✅ Checklist trình sếp & audit

👉 Đệ tử chọn bài tiếp theo, sư phụ đi cùng tới Architect thật sự 😄