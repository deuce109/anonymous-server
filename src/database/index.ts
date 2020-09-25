import { RedisDatabase } from './redis'
import { MockDatabase } from './mock'
import { SQLiteDatabase } from './sqlite'
import { IIntermediary } from '../types'

export interface IDatabase {
  type: string
  connectionString: string
  get: (appName: string, id: string) => Promise<IIntermediary>
  insert: (object: IIntermediary, app: string) => Promise<string>
  update: (appName: string, id: string, object: IIntermediary) => Promise<string>
  delete: (appName: string, id: string) => Promise<string>
  getAll: (appName: string) => Promise<IIntermediary[]>
  delAll: (appName: string) => Promise<string>
  overwrite: (appName: string, id: string, object: IIntermediary) => Promise<any>
  ping: (callback?: () => string) => boolean
}

const windowsFilePathRegex: RegExp = /[A-Z]\:(\\[\w\d\ \^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\%\.\+\~\_]+)*/

const unixFilePathRegex: RegExp = /^(((?:\.\/|\.\.\/|\/)?(?:\.?\w+\/)*)(\.?\w+\.?\w+))$/
export function createDatabase(connectionString: string): IDatabase {
  if (connectionString.slice(0, 5) === 'redis') {
    return new RedisDatabase(connectionString)
  } else if (connectionString === 'mock') {
    return new MockDatabase()
  } else if (windowsFilePathRegex.test(connectionString) || unixFilePathRegex.test(connectionString) || connectionString === ':memory:') {
    return new SQLiteDatabase(connectionString)
  } else {
    return undefined
  }
}
