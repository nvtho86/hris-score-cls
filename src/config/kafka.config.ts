import { KafkaOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
dotenv.config();
export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'integration-service',
      brokers: process.env.KAFKA_BROKERS?.split(',') || ['kafka:9092'], // local test
    },
    consumer: {
      groupId: 'rebuild-lms-employee-2025',
      // topic: 'hris.employee.updated',
      // fromBeginning: true,
    },
  },
};
