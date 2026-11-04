import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { LmsService } from '../lms/lms.service';
import { MailService } from '../mail/mail.service';
import { LmsRouteService } from '../lms/route.service';
import { LmsCourseService } from '../lms/lms.course.service';
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
        private readonly routeService: LmsRouteService,
        private readonly lmsCourseService: LmsCourseService,
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
        await consumer.subscribe({
            topic: 'hris.route.updated',
            fromBeginning: true,
        });
        await consumer.subscribe({
            topic: 'hris.course.updated',
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

                        case 'hris.course.updated':
                            const courses = Array.isArray(event.payload)
                                ? event.payload
                                : [event.payload];

                            for (const [index, course] of courses.entries()) {

                                try {
                                    console.log(
                                        `[SYNC] ${course.Code} -> LMS START`,
                                    );
                                    // HRIS -> LMS
                                    await this.lmsCourseService.upsertCourse(course);
                                    console.log(
                                        `[SYNC] ${course.Code} -> LMS DONE`,
                                    );

                                } catch (error: unknown) {
                                    console.error(
                                        `[SYNC] ${course.Code} FAILED`,
                                        error,
                                    );
                                }
                            }
                            
                            break;

                        case 'hris.route.updated':
                            const routes = Array.isArray(event.payload)
                                ? event.payload
                                : [event.payload];

                            for (const [index, route] of routes.entries()) {

                                try {
                                    console.log(
                                        `[SYNC] ${route.Code} -> LMS START`,
                                    );
                                    // SCORE -> LMS
                                    await this.routeService.upsertRoute(route);
                                    console.log(
                                        `[SYNC] ${route.Code} -> LMS DONE`,
                                    );

                                } catch (error: unknown) {
                                    console.error(
                                        `[SYNC] ${route.Code} FAILED`,
                                        error,
                                    );
                                }
                            }

                            break;

                        case 'hris.user.updated': {
                            const users = Array.isArray(event.payload)
                                ? event.payload
                                : [event.payload];

                            const total = users.length;
                            let success = 0;
                            let failed = 0;
                            const errors: string[] = [];

                            for (const [index, user] of users.entries()) {
                                console.log(
                                    `[SYNC] ${index + 1}/${users.length} START`,
                                    user.Code,
                                );

                                try {

                                    // HRIS -> SCORE
                                    // await handleUser({
                                    //     ...event,
                                    //     payload: user,
                                    // });

                                    console.log(
                                        `[SYNC] ${user.Code} -> LMS START`,
                                    );
                                    // SCORE -> LMS
                                    await this.lmsService.upsertUser(user);
                                    console.log(
                                        `[SYNC] ${user.Code} -> LMS DONE`,
                                    );

                                    success++;

                                } catch (error: unknown) {
                                    console.error(
                                        `[SYNC] ${user.Code} FAILED`,
                                        error,
                                    );
                                    failed++;

                                    const errorMessage =
                                        error instanceof Error
                                            ? error.message
                                            : String(error);

                                    errors.push(
                                        `${user.code || user.email || 'Unknown user'}: ${errorMessage}`,
                                    );
                                }
                                console.log(
                                    `[SYNC] ${index + 1}/${users.length} END`,
                                    user.Code,
                                );
                            }

                            await this.mailService.sendSyncMail({
                                users,
                                system: 'HRIS->SCORE, HRIS->LMS',
                                total,
                                success,
                                failed,
                                errors,
                                to: ['tho.nv@svtech.com.vn'],
                                cc: [''],
                            });


                            break;
                        }
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
