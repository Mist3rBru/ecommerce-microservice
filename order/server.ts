import 'dotenv/config'
import { App } from './app';
import { KafkaAdapter, Router } from './kafka'
;(async () => {
  const kafka = new KafkaAdapter({
    clientId: process.env.KAFKA_ID || 'order-api',
    brokers: [process.env.KAFKA_BROKER],
    retry: {
      initialRetryTime: parseInt(process.env.KAFKA_RETRY_TIME),
      retries: parseInt(process.env.KAFKA_RETRY_TIMES),
    },
  })

  await kafka.listen({
    groupId: process.env.KAFKA_ID + '_group' || 'order-group',
    router: new Router(),
  })

  const app = new App()
  const port = process.env.APP_PORT || '3003'

  app.listen(port)
})()
