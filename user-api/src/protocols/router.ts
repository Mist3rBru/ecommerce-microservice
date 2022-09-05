import { IController, Topic } from '.'

export type IRouter = Record<Topic, IController>
