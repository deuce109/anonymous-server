import { IDatabase } from './index'
import * as redis from 'redis'
import { Callback } from 'redis'
import { guid, sleep, mergeObjectsWithOverwrite, log } from '../utils'
export class RedisDatabase implements IDatabase {
  public type = 'redis'
  public ping(): any {
    return this.client.ping()
  }
  public async update(appName: string, key: string, object: any): Promise<any> {
    const objectToUpdate = await this.get(appName, key)
    const newObject = mergeObjectsWithOverwrite(objectToUpdate, object)
    const deletePass: any = await this.delete(appName, key)
    return deletePass ? await this.insert(newObject, appName) : deletePass
  }

  public async delete(appName: string, key: string): Promise<any> {
    const objects = await this.getAll(appName)
    const item = objects.find((x) => x.id === key)
    return this.client.srem(appName, JSON.stringify(item))
  }

  public async get(appName: string, id: string): Promise<any> {
    const items = await this.getAll(appName)
    const item = items.find((x) => x.id === id)
    return item
  }

  public async overwrite(appName: string, key: string, object: any): Promise<any> {
    const deletePass: any = await this.delete(appName, key)
    return deletePass ? await this.insert(object, appName) : deletePass
  }

  public async delAll(appName: string): Promise<any> {
    const objects = await this.getAll(appName)
    let success = true
    objects.forEach(
      async (obj) =>
        (success =
          success !== (await this.client.srem(appName, JSON.stringify(obj)))),
    )
    return success
  }

  public async insert(object: any, app: string): Promise<any> {
    object.id = object.id || guid()
    const ids = (await this.getAll(app)).map((obj) => {
      return obj.id
    })
    if (ids.includes(object.id)) { return 'conflict' }
    return this.client.sadd(app, JSON.stringify(object)) ? 'ok' : ''
  }

  public async getAll(appName: string): Promise<any[]> {
    const result = []

    const cb = (_, data) => {
      data.forEach((value: string) => {
        result.push(JSON.parse(value))
      })
    }

    await this.client.smembers(appName, cb)
    await sleep(1000)

    return result
  }

  constructor(connectionString: string) {
    this.connectionString = connectionString
    this.client = redis.createClient(connectionString)
    this.client.on('connect', () => {
      log('info', 'Redis connected')
    })
    this.client.on('error', (error: any) => {
      log('error', error)
    })
  }

  public client: redis.RedisClient

  public connectionString: string
}
