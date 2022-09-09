import 'dotenv/config'
import { KafkaAdapter, ProducerAdapter, Router } from './kafka'
;(async () => {
  const kafka = new KafkaAdapter({
    clientId: process.env.KAFKA_ID || 'payment-api',
    brokers: [process.env.KAFKA_BROKER],
    retry: {
      initialRetryTime: parseInt(process.env.KAFKA_RETRY_TIME),
      retries: parseInt(process.env.KAFKA_RETRY_TIMES),
    },
  })

  const producer = new ProducerAdapter(kafka.producer)

  await kafka.listen({
    groupId: process.env.KAFKA_ID ? process.env.KAFKA_ID + '_group' : 'payment-group',
    router: new Router(producer),
  })
})()
