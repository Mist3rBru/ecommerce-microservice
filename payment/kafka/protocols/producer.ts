export interface IProducer {
  send(data: IProducer.Props): Promise<void>
}

export namespace IProducer {
  export interface Props {
    topic: string
    value: Record<string, any>
  }
}
