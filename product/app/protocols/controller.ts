export type MessageHandler = (value: any) => Promise<void>

export interface IController {
  handle(request: any): Promise<void>
}
