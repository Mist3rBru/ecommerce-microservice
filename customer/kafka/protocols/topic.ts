export interface ITopicHandler {
  handle(value: any): Promise<void>
}

export type Topic = null
