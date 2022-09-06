import { IController } from '../../app/protocols'
import { Topic } from './topic'

export type IRouter = Record<Topic, IController>
