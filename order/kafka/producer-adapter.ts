import { Producer } from 'kafkajs'
import { IProducer } from './protocols'

export class ProducerAdapter implements IProducer {
  constructor(private readonly producer: Producer) {}

  async send({ topic, value }: IProducer.Props): Promise<void> {
    this.producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(value),
        },
      ],
    })
  }
}
