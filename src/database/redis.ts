import { Database } from "./index";
import * as redis from "redis";
export class RedisDatabase implements Database {
  get(selector: (object: any, key?: any) => any) {
    this.getAll().find(selector);
  }
  insert(object: any) {}
  update(selector: (object: any, key?: any) => any, object: any) {}
  delete(selector: (object: any, key?: any) => any) {}
  getAll(): any[] {
    return [];
  }
  constructor(connectionString: string) {
    this.connectionString = connectionString;
    this.client = redis.createClient(connectionString);
  }
  client: redis.RedisClient;
  connectionString: string;
}
