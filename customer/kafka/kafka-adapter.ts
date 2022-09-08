import { Kafka, logLevel, Producer } from 'kafkajs'
import { IRouter } from './protocols'

interface KafkaAdapterProps {
  clientId: string
  brokers: string[]
  logLevel?: logLevel
  retry?: {
    initialRetryTime: number
    retries: number
  }
}

interface KafkaListenProps {
  groupId: string
  router: IRouter
}

export class KafkaAdapter {
  private readonly kafkaConfig: KafkaAdapterProps
  private readonly kafka: Kafka
  public readonly producer: Producer
  constructor(kafkaConfig: KafkaAdapterProps) {
    this.kafkaConfig = kafkaConfig
    this.kafka = new Kafka({
      ...kafkaConfig,
      logLevel: kafkaConfig.logLevel || logLevel.WARN,
    })
    this.producer = this.setupProducer()
  }

  private setupProducer(): Producer {
    const producer = this.kafka.producer()
    producer.connect()
    return producer
  }

  async listen({ groupId, router }: KafkaListenProps): Promise<void> {
    process.stdout.write(`${this.kafkaConfig.clientId} is loading...\n`)
    const consumer = this.kafka.consumer({ groupId })
    await consumer.connect()
    await consumer.subscribe({
      topics: Object.entries(router).map(([key]) => key),
      fromBeginning: true,
    })
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        router[topic].handle(JSON.parse(message.value.toString()))
      },
    })
    process.stdout.write(`${this.kafkaConfig.clientId} is running\n`)
  }
}
