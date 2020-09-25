import { IServer } from '.'
import { IDatabase, createDatabase } from '../database'

export class MockServer implements IServer {
  public use: (middleware: (req: Request, res: Response, next?: any) => void) => void
  public listen = (port: number, callback?: (...args: any[]) => void) => {
    if (typeof port === 'undefined' || port >= 65535 || port < 0) {
      throw new Error('port must be a valid number less than 65535 and greater than 0')
    }
    this.port = port
    if (typeof callback === 'function') {
      callback()
    }
  }
  public port: number
  public db: IDatabase

  constructor() {
    this.db = createDatabase('mock')
  }
}
