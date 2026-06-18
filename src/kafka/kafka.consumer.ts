import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { LmsService } from '../lms/lms.service';
import { handleEmployee } from './handlers/employee.handler';
import { handleStaff } from './handlers/staff.handler';
import { handleUser } from './handlers/user.handler';
import { handleTrainingClassResult } from './handlers/training-class-result.handler';

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
                            await handleEmployee(event);
                            break;
        
                        case 'hris.staff.updated':
                            await handleStaff(event);
                            // await this.lmsService.upsertUser(
                            //     event.payload,
                            // );
                            break;

                        case 'training.class-result.created':
                            await handleTrainingClassResult(event);
                            break;

                        case 'hris.user.updated':
                            await handleUser(event);
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
