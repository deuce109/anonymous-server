import * as express from 'express'
import { IServer, ExpressServer } from './server'
import { IDatabase, RedisDatabase } from './database'


const db: IDatabase = new RedisDatabase('redis://localhost:6379')

const server: IServer = new ExpressServer(
  express(),
  parseInt(process.env.PORT, 10) || 3030,
  db,
)

server.listen()
