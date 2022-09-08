import { Topic, ITopicHandler } from './index'

export type IRouter = Record<Topic, ITopicHandler>
