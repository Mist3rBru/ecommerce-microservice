import { Order } from '@/order/models'
import { IProducer, IRouter, ITopicHandler } from './protocols'

export class Router implements IRouter {
  constructor (
    private readonly producer: IProducer
  ) {}
  
  'order.created' = new HandleOrderCreated(this.producer)
}

class HandleOrderCreated implements ITopicHandler {
  constructor (private readonly producer: IProducer) {}
  
  async handle(order: Order): Promise<void> {
    order.status = 'approved'
    await this.producer.send({
      topic: 'order.result',
      value: {
        id: order.id,
        status: order.status
      }
    })
  }
}
