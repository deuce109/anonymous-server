import { Server } from "./index";
import { Express } from "express";
export class MockServer implements Server {
  listen: () => void;
  server: Express;
  port: number;
  db: any;
}
