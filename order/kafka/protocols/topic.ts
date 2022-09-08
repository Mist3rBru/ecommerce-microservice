export interface ITopicHandler {
  handle(value: any): Promise<void>
}

export type Topic = 'user.created' | 'product.created'
