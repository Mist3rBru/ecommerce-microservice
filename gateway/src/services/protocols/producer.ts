export interface IProducer {
  send(params: IProducer.Params): Promise<void>
}

export namespace IProducer {
  export interface Params {
    topic: string
    value: Record<string, any>
  }
}