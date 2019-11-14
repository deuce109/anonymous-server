import { Database } from "./index";
import * as redis from "redis";
import { guid, sleep, mergeObjectsWithOverwrite } from "../utils";
export class RedisDatabase implements Database {
  ping() {
    return this.client.ping();
  }
  async update(appName: string, key: string, object: any) {
    let objectToUpdate = await this.get(appName, key);
    let newObject = mergeObjectsWithOverwrite(objectToUpdate, object);
    let deletePass: any = await this.delete(appName, key);
    return deletePass ? await this.insert(newObject, appName) : deletePass;
  }

  async delete(appName: string, key: string) {
    let objects = await this.getAll(appName);
    let item = objects.find(x => x.id == key);
    return this.client.srem(appName, JSON.stringify(item));
  }

  async get(appName: string, id: string) {
    let items = await this.getAll(appName);
    let item = items.find(x => x.id == id);
    return item;
  }

  async overwrite(appName: string, key: string, object: any) {
    let deletePass: any = await this.delete(appName, key);
    return deletePass ? await this.insert(object, appName) : deletePass;
  }

  async delAll(appName: string) {
    let objects = await this.getAll(appName);
    let success = true;
    objects.forEach(
      async obj =>
        (success =
          success != (await this.client.srem(appName, JSON.stringify(obj))))
    );
    return success;
  }

  async insert(object: any, app: string) {
    object["id"] = object["id"] || guid();
    return this.client.sadd(app, JSON.stringify(object));
  }

  async getAll(appName: string): Promise<any[]> {
    let result = [];

    let cb = (_, data) => {
      data.forEach((value: string) => {
        result.push(JSON.parse(value));
      });
    };

    await this.client.smembers(appName, cb);
    await sleep(1000);

    return result;
  }

  constructor(connectionString: string) {
    this.connectionString = connectionString;
    this.client = redis.createClient(connectionString);
    this.client.on("connect", () => {
      console.log("Redis connected");
    });
    this.client.on("error", (error: any) => {
      console.log(error);
    });
  }

  client: redis.RedisClient;

  connectionString: string;
}
