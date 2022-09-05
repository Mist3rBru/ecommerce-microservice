import { KafkaAdapter } from './adapters'
import { Router } from './router'

const app = new KafkaAdapter({
  clientId: 'Microservice',
  brokers: ['localhost:9092'],
  retry: {
    initialRetryTime: 300,
    retries: 10,
  },
})
const router = new Router()

app.listen({
  groupId: 'gateway-group',
  router,
})
