import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Kafka, Producer, logLevel } from 'kafkajs';

function sleep(ms: number) {
    return new Promise(res => setTimeout(res, ms))
}

@Injectable()
export class KafkaProducer implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(KafkaProducer.name)
    private producer: Producer
    constructor() {
        const kafka = new Kafka({
            clientId: process.env.KAFKA_CLIENT_ID ?? 'expense-tracker-api',
            brokers: [process.env.KAFKA_BROKER ?? 'localhost:9092'],
            ssl: !!process.env.KAFKA_SSL,
            sasl: process.env.KAFKA_USER && process.env.KAFKA_PASS ? {
                mechanism: 'plain',
                username: process.env.KAFKA_USER!,
                password: process.env.KAFKA_PASS!,
            } : undefined,
            logLevel: logLevel.NOTHING,
        });
        this.producer = kafka.producer()
    }

    async onModuleInit() {
        await this.producer.connect()
        this.logger.log('Kafka producer connected')
    }

    async onModuleDestroy() {
        await this.producer.disconnect()
    }

    async send(topic: string, message: unknown, key?: string, headers?: Record<string, string>) {
        await this.producer.send({
            topic,
            messages: [{ key, value: JSON.stringify(message), headers }],
        });
    }
}
