import { IDatabase } from './index'
import * as redis from 'redis'
import { guid, sleep, mergeObjectsWithOverwrite } from '../utils'
import Logger from '../logging'
import { IIntermediary } from '../types'

export class RedisDatabase implements IDatabase {
  public get(appName: string, id: string) {
    return new Promise<IIntermediary>((resolve, reject) => {
      this.client.get(`${appName}-${id}`, (err, value) => {
        if (err !== null && typeof err !== 'undefined') {
          Logger.error(err.message)
          reject(err)
          throw (err)
        }

        resolve(JSON.parse(value) as IIntermediary)
      })
    })
  }
  public insert(object: IIntermediary, app: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.client.scan('0', 'MATCH', `${app}-*`, (err, result) => {
        object.id = object.id || guid()
        if (err) {
          Logger.error(err.message)
          reject(err)
          throw (err)
        }
        if (result[1].includes(object.id)) {
          resolve('conflict')
        }
        this.client.set(`${app}-${object.id}`, JSON.stringify(object), (error) => {
          if (error) {
            Logger.error(error.message)
            resolve('failed')
          }
          resolve(object.id)
        })
      })
    })
  }
  public update(appName: string, id: string, object: IIntermediary): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const oldObject = await this.get(appName, id)
        const newObject = mergeObjectsWithOverwrite(oldObject, object)
        this.client.set(`${appName}-${id}`, JSON.stringify(newObject), (error) => {
          if (error) {
            Logger.error(error.message)
            resolve('failed')
          }
          resolve('ok')
        })
      } catch (e) {
        Logger.error(e.message)
        reject(e)
      }
    })
  }
  public delete(appName: string, id: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.client.del(`${appName}-${id}`, (err, data) => {
        if (err) {
          Logger.error(err.message)
          resolve('failed')
        }
        resolve('ok')
      })
    })
  }
  public getAll(appName: string): Promise<IIntermediary[]> {
    return new Promise<IIntermediary[]>((resolve, reject) => {
      this.client.scan('0', 'MATCH', `${appName}-*`, async (err, results) => {
        if (err) {
          Logger.error(err.message)
          reject(err)
          throw (err)
        }
        const intermediaries: IIntermediary[] = []

        for (const result of results[0]) {
          intermediaries.push(await this.get(appName, result.replace(`${appName}-`, '')))
        }

        resolve(intermediaries)
      })
    })
  }

  public delAll(appName: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.client.scan('0', 'MATCH', `${appName}-*`, (err, data) => {
        if (err) {
          Logger.error(err.message)
          reject(err)
          throw (err)
        }
        data.forEach((key) => this.client.del(key, (error) => {
          if (error) {
            Logger.error(error.message)
            resolve('failed')
          }
        }))
        resolve('ok')
      })
    })
  }
  public async overwrite(appName: string, key: string, object: IIntermediary): Promise<string> {
    return (await this.insert(object, appName) === object.id) ? 'ok' : 'failed'
  }
  public type = 'redis'
  public ping(callback: () => any = () => ''): any {
    callback()
    return this.client.ping()
  }


  constructor(connectionString: string) {
    this.connectionString = connectionString
    this.client = redis.createClient(connectionString)
    this.client.on('connect', () => {
      Logger.info('Redis connected')
    })
    this.client.on('error', (error: any) => {
      Logger.error(error)
    })

    this.getAll = this.getAll.bind(this)
    this.get = this.get.bind(this)
    this.delAll = this.delAll.bind(this)
    this.delete = this.delete.bind(this)
    this.insert = this.insert.bind(this)
    this.overwrite = this.overwrite.bind(this)
    this.ping = this.ping.bind(this)
    this.update = this.update.bind(this)
  }

  private client: redis.RedisClient

  public connectionString: string
}
