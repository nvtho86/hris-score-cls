import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { LmsService } from '../lms/lms.service';
import { MailService  } from '../mail/mail.service';
import { handleEmployee } from './handlers/employee.handler';
import { handleStaff } from './handlers/staff.handler';
import { handleUser } from './handlers/user.handler';
import { handleTrainingClassResult } from './handlers/training-class-result.handler';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class KafkaConsumer implements OnModuleInit {
    constructor(
        private readonly lmsService: LmsService,
        private readonly mailService: MailService,
    ) { }

    async onModuleInit() {
        const kafka = new Kafka({
            clientId: 'integration-service',
            brokers: process.env.KAFKA_BROKERS?.split(',') || ['kafka:9092'], //
        });

        const consumer = kafka.consumer({ groupId: 'integration-group' });

        await consumer.connect();
        await consumer.subscribe({
            topic: 'hris.employee.updated',
            fromBeginning: true,
        });
        await consumer.subscribe({
            topic: 'hris.staff.updated',
            fromBeginning: true,
        });
        await consumer.subscribe({
            topic: 'training.class-result.created',
            fromBeginning: true,
        });
        await consumer.subscribe({
            topic: 'hris.user.updated',
            fromBeginning: true,
        });
        await consumer.run({
            eachMessage: async ({ topic, message }) => {
        
                try {
        
                    if (!message.value) {
                        return;
                    }
        
                    const event = JSON.parse(
                        message.value.toString(),
                    );

                    console.log(
                        JSON.stringify(event, null, 2)
                    );
        
                    console.log(`Receive Topic: ${topic}`);
        
                    switch (topic) {
        
                        case 'hris.employee.updated':
                            // await handleEmployee(event);
                            break;
        
                        case 'hris.staff.updated':
                            // await handleStaff(event);
                            break;

                        case 'training.class-result.created':
                            await handleTrainingClassResult(event);
                            break;

                        case 'hris.user.updated':
                            await handleUser(event);
                            await this.lmsService.upsertUser(
                                event.payload,
                            );
                            // await this.mailService.sendSyncMail({
                            //      system: "Hris->CLS",
                            //      total: 150,
                            //      success: 150,
                            //      failed: 0,
                            //      errors: [],
                            //      to: ["tho.nv@svtech.com.vn"]
                            // });

   
                            break;
        
                        default:
                            console.warn(
                                `Unknown topic: ${topic}`,
                            );
                    }
        
                } catch (error) {
        
                    console.error(
                        'Kafka Consumer Error',
                        error,
                    );
        
                }
            },
        });
    }
}
