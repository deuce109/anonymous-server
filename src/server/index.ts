import { Express } from "express";
import { Database } from "../database";
export interface Server {
  server: Express;
  port: number;
  db: Database;
  listen: () => void;
}

export * from "./server";
export * from "./mockServer";
