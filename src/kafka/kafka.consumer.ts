import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { crmDb } from '../database/crm.db';
import { LmsService } from '../lms/lms.service';

@Injectable()
export class KafkaConsumer implements OnModuleInit {
    constructor(private readonly lmsService: LmsService) { }

    async onModuleInit() {
        const kafka = new Kafka({
            clientId: 'integration-service',
            brokers: ['localhost:9092'],
        });

        const consumer = kafka.consumer({ groupId: 'integration-group' });

        await consumer.connect();
        await consumer.subscribe({
            topic: 'hris.employee.updated',
            fromBeginning: true,
        });

        await consumer.run({
            eachMessage: async ({ message }) => {
                if (!message.value) {
                    console.warn('Kafka message value is null, skip');
                    return;
                }

                const event = JSON.parse(message.value.toString());

                const emp = event.payload;

                // 1️⃣ Update CRM DB trung gian
                await crmDb.query(
                    `
                    INSERT INTO employees_projection
                    (employee_id, email, full_name, status, synced_at)
                    VALUES ($1,$2,$3,$4,now())
                    ON CONFLICT (employee_id)
                    DO UPDATE SET
                        email = EXCLUDED.email,
                        full_name = EXCLUDED.full_name,
                        status = EXCLUDED.status,
                        synced_at = now()
                    `,
                    [emp.employee_id, emp.email, emp.full_name, emp.status],
                );

                // 2️⃣ Call LMS API
                await this.lmsService.upsertUser(emp);
            },
        });

    }
}
