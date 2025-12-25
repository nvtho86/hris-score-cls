import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'integration-service',
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: 'rebuild-lms-employee-2025',
      // topic: 'hris.employee.updated',
      // fromBeginning: true,
    },
  },
};
