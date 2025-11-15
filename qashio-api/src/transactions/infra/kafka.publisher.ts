import { Injectable } from '@nestjs/common';
import { KafkaProducer } from '../../kafka/kafka.producer';

@Injectable()
export class KafkaPublisher {
  constructor(private readonly kafkaProducer: KafkaProducer) {}

  async publish(topic: string, payload: unknown) {
    await this.kafkaProducer.send(topic, payload)
  }
}
