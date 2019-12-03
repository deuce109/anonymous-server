import { Express } from 'express'
import { IDatabase } from '../database'
export interface IServer {
  server: Express
  port: number
  db: IDatabase
  listen: () => void
}

export * from './server'
export * from './mockServer'
