import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Kafka, Consumer, logLevel } from 'kafkajs';

@Injectable()
export class KafkaConsumer implements OnModuleInit {
    private readonly logger = new Logger(KafkaConsumer.name);
    private consumer: Consumer;

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
        this.consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID ?? 'expense-tracker-group' })
    }

    async onModuleInit() {
        await this.consumer.connect()
        await this.consumer.subscribe({ topic: 'transactions.created', fromBeginning: false })
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const key = message.key?.toString()
                    const rawValue = message.value?.toString()

                    if (!rawValue || !rawValue.trim()) {
                        this.logger.warn(`Received empty Kafka message for topic "${topic}" partition ${partition}. Key: ${key ?? 'n/a'}`)
                        return
                    }

                    let payload: unknown

                    try {
                        payload = JSON.parse(rawValue)
                    } catch (parseError) {
                        this.logger.error(
                            `Failed to parse Kafka message for topic "${topic}" partition ${partition}. Key: ${key ?? 'n/a'}. Raw payload: ${rawValue}`,
                            parseError instanceof Error ? parseError.stack : String(parseError),
                        )
                        return
                    }
                    console.log(payload)
                } catch (err) {
                    this.logger.error(err)
                    throw err
                }
            },
        })
        this.logger.log('Kafka consumer running')
    }
}
