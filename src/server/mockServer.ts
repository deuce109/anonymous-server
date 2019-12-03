import { IServer } from './index'
import { Express } from 'express'
export class MockServer implements IServer {
  public listen: () => void
  public server: Express
  public port: number
  public db: any
}
