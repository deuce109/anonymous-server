import { IServer } from '.'

export class MockServer implements IServer {
  public listen: (port: number, callback?: (...args: any[]) => void) => void
  public port: number
  public db: any
}
