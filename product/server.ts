import 'dotenv/config'
import { App } from './app'

;import { KafkaAdapter, ProducerAdapter } from './kafka';
(async () => {
  const kafka = new KafkaAdapter({
    clientId: process.env.KAFKA_ID || 'product-api',
    brokers: [process.env.KAFKA_BROKER],
    retry: {
      initialRetryTime: parseInt(process.env.KAFKA_RETRY_TIME),
      retries: parseInt(process.env.KAFKA_RETRY_TIMES),
    },
  })

  const producer = new ProducerAdapter(kafka.producer)

  const app = new App(producer)
  const port = process.env.APP_PORT || '3002'
  
  app.listen(port)
})()
