import { RedisDatabase } from './redis'
import { MockDatabase } from './mock'

export interface IDatabase {
  type: string
  connectionString: string
  get: (appName: string, id: string) => Promise<any>
  insert: (object: any, app: string) => Promise<any>
  update: (appName: string, key: string, object) => Promise<any>
  delete: (appName: string, key: string) => Promise<any>
  getAll: (appName: string) => Promise<any[]>
  delAll: (appName: string) => Promise<any>
  overwrite: (appName: string, key: string, object: any) => Promise<any>
  ping: (callback?: () => string) => any
}

export function createDatabase(connectionString: string): IDatabase {
  if (connectionString.slice(0, 5) === 'redis') {
    return new RedisDatabase(connectionString)
  } else if (connectionString === 'mock') {
    return new MockDatabase()
  }
}

export * from './redis'
export * from './mock'
