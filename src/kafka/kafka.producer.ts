import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class KafkaProducer implements OnModuleInit {
  private producer;

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'integration-service',
      brokers: process.env.KAFKA_BROKERS?.split(',') || ['kafka:9092'], 
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
