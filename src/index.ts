import * as express from "express";
import { Server, ExpressServer } from "./server";
import { Database, RedisDatabase } from "./database";

let array = [];

let db: Database = new RedisDatabase("redis://localhost:6379");

let server: Server = new ExpressServer(
  express(),
  parseInt(process.env.PORT) || 3030,
  db
);

server.listen();
