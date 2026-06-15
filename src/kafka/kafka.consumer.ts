import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { LmsService } from '../lms/lms.service';
import { handleEmployee } from './handlers/employee.handler';
import { handleStaff } from './handlers/staff.handler';
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
        // await consumer.run({
        //     eachMessage: async ({ message }) => {
        //         if (!message.value) {
        //             console.warn('Kafka message value is null, skip');
        //             return;
        //         }
                
        //         const event = JSON.parse(message.value.toString());
        //         console.log("-------------------------")
        //         console.log(JSON.stringify(event, null, 2));
        //         console.log("-------------------------")
        //         const emp = event.payload;

        //         // 1️⃣ Update CRM DB trung gian
        //         await crmDb.query(
        //             `
        //             INSERT INTO employees_projection
        //             (employee_id, email, full_name, status, synced_at)
        //             VALUES ($1,$2,$3,$4,now())
        //             ON CONFLICT (employee_id)
        //             DO UPDATE SET
        //                 email = EXCLUDED.email,
        //                 full_name = EXCLUDED.full_name,
        //                 status = EXCLUDED.status,
        //                 synced_at = now()
        //             `,
        //             [emp.employee_id, emp.email, emp.full_name, emp.status],
        //         );

                
               
        //         // 2️⃣ Call LMS API
        //         await this.lmsService.upsertUser(emp);
        //     },
        // });

        // await consumer.subscribe({
        //     topic: 'hris.staff.updated',
        //     fromBeginning: true,
        // });

        // await consumer.run({
        //     eachMessage: async ({ message }) => {
        //         if (!message.value) {
        //             console.warn('Kafka message value is null, skip');
        //             return;
        //         }
                
        //         const event = JSON.parse(message.value.toString());
        //         console.log("-------------------------")
        //         console.log(JSON.stringify(event, null, 2));
        //         console.log("-------------------------")
        //         const emp = event.payload;

        //         // 1️⃣ Update CRM DB trung gian
        //         await crmDb.query(
        //             `
        //             INSERT INTO staff
        //             (code, full_name, branch, department, team, job_title, level, manager_code, manager_name, email, modified_date)
        //             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,now())
        //             ON CONFLICT (code)
        //             DO UPDATE SET
        //                 code =EXCLUDED.code,
        //                 full_name =EXCLUDED.full_name,
        //                 branch =EXCLUDED.branch,
        //                 department =EXCLUDED.department,
        //                 team =EXCLUDED.team,
        //                 job_title =EXCLUDED.job_title,
        //                 level =EXCLUDED.level,
        //                 manager_code =EXCLUDED.manager_code,
        //                 manager_name =EXCLUDED.manager_name,
        //                 email =EXCLUDED.email,
        //                 modified_date = now()
        //             `,
        //             [emp.code,emp.full_name, emp.branch, emp.department,emp.team,emp.job_title,emp.level,emp.manager_code,emp.manager_name,emp.email],
        //         );

        //     },
        // });


    }
}
