import { IDatabase } from '../database'

export * from './mockServer'
export * from './server'

export interface IServer {
  listen: (port: number, ...args: any[]) => void
  port: number
  db: IDatabase


}