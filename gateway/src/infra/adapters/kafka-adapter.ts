import { Kafka, Producer } from 'kafkajs'
import { IProducer } from '@/services/protocols'

const kafka = new Kafka({
  clientId: 'gateway',
  brokers: ['localhost:9092'],
  retry: {
    initialRetryTime: 300,
    retries: 10,
  },
})

export class KafkaAdapter implements IProducer {
  private readonly producer: Producer = this.setupProducer()  

  private setupProducer () {
    const producer = kafka.producer()
    producer.connect()
    return producer
  }
  
  async send(data: IProducer.Params): Promise<void> {
    this.producer.send({
      topic: data.topic,
      messages: [{
        value: JSON.stringify(data.value)
      }]
    })
  }
}
