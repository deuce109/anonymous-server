import { IDatabase } from './'
import * as sqlite from 'sqlite3'
import Log from '../logging'
import { guid, sleep, mergeObjectsWithOverwrite } from '../utils'
import { IIntermediary } from '../types'

export class SQLiteDatabase implements IDatabase {
    constructor(connectionString: string, errorCallback?: (err: Error) => void) {

        const callback = errorCallback || ((err: Error) => {
            if (err !== null) {
                Log.error(err.message)
                return
            }

            Log.info('SQL Database connected at ' + connectionString)
        })

        this.db = new sqlite.Database(connectionString, sqlite.OPEN_READWRITE, callback)
        this.db.run('CREATE TABLE config (id TEXT, json TEXT)')
        this.connectionString = connectionString
        this.connected = (typeof this.db !== 'undefined' && typeof this.connectionString !== 'undefined' && this.db !== null && this.connectionString !== null)
    }

    public initTable = async (appName: string) => {
        return new Promise<boolean>((resolve, reject) => {
            this.db.run(`CREATE TABLE '${appName}' (id TEXT, json TEXT)`, function(this: sqlite.RunResult, err: Error) {
                if (err !== null && typeof err !== 'undefined') {
                    Log.error(err.message)
                    reject(err)
                    throw (err)
                }

                resolve(this ? true : false)
            })
        })
    }
    public type: string = 'sqlite'
    public connectionString: string
    public get = async (appName: string, id: string) => {
        return new Promise<IIntermediary>((resolve, reject) => {
            this.db.get(`SELECT * FROM ${appName} as object WHERE object.id = '${id}'`, (err: Error, result) => {
                if (err !== null && typeof err !== 'undefined') {
                    Log.error(err.message)
                    reject(err)
                    throw (err)
                }
                resolve({ id: result.id, object: result.json })

            })
        })
    }
    public insert = async (object: any, app: string) => {
        const jsonObject = { id: guid(), json: JSON.stringify(object) }

        return new Promise<string>((resolve, reject) => {
            this.db.run(`CREATE TABLE IF NOT EXISTS ${app} (id TEXT, json TEXT)`)
            this.db.run(`INSERT INTO ${app}  VALUES('${jsonObject.id}' , '${jsonObject.json}' )`, function(this: sqlite.RunResult, err: Error) {
                if (err !== null && typeof err !== 'undefined') {
                    Log.error(err.message)
                    reject(err)
                    throw (err)
                }
                if (this.changes === 1) {
                    resolve(jsonObject.id)
                } else {
                    resolve('failed')
                }
            })
        })
    }
    public update = async (appName: string, key: string, object: any) => {
        const oldObject = await this.get(appName, key)
        const newObject = mergeObjectsWithOverwrite(oldObject, object)

        return new Promise<string>((resolve, reject) => {
            this.db.run(`UPDATE ${appName} SET json = '${JSON.stringify(newObject)}' WHERE id = '${newObject.id}'`, function(this: sqlite.RunResult, err: Error) {
                if (err !== null && typeof err !== 'undefined') {
                    Log.error(err.message)
                    reject(err)
                    throw (err)
                }
                resolve(this.changes === 1 ? 'ok' : 'failed')
            })
        })
    }
    public delete = async (appName: string, key: string) => {


        return new Promise<string>((resolve, reject) => {
            this.db.run(`DELETE FROM ${appName} WHERE id = '${key}'`, function(this: sqlite.RunResult, err: Error) {
                if (err !== null && typeof err !== 'undefined') {
                    Log.error(err.message)
                    reject(err)
                    throw (err)
                }
                resolve(this.changes === 1 ? 'ok' : 'failed')
            })
        })

    }
    public getAll = async (appName: string) => {
        return new Promise<any[]>((resolve, reject) => {
            this.db.all(`SELECT * FROM ${appName}`, (err: Error, rows: any[]) => {

                if (err !== null && typeof err !== 'undefined') {
                    Log.error(err.message)
                    reject(err)
                    throw (err)
                }

                resolve(rows !== null ? rows.map((row) => {
                    const object = JSON.parse(row.json)
                    object.id = row.id
                    return object
                }) : [])
            })
        })
    }
    public delAll = async (appName: string) => {


        return new Promise<string>((resolve, reject) => {
            this.db.run(`DELETE FROM ${appName} WHERE true = true`, function(this: sqlite.RunResult, err: Error) {
                let status: string | number
                if (err !== null && typeof err !== 'undefined') {
                    Log.error(err.message)
                    reject(err)
                    throw (err)
                }
                if (this.changes >= 1) {
                    status = 'ok'
                } else {
                    status = 'failed'
                }
                resolve(status)
            })
        })

    }
    public overwrite = async (appName: string, key: string, object: any) => {


        return new Promise<string>((resolve, reject) => {
            this.db.run(`UPDATE ${appName} SET json = '${JSON.stringify(object)}' WHERE id = '${key}'`, function(this: sqlite.RunResult, err: Error) {

                if (err !== null && typeof err !== 'undefined') {
                    Log.error(err.message)
                    reject(err)
                    throw (err)
                }
                resolve(this.changes === 1 ? 'ok' : 'failed')
            })
        })

    }


    public ping = (callback?: () => string) => {
        if (typeof callback === 'function') {
            callback()
        }
        return this.connected
    }

    private db: sqlite.Database

    private connected: boolean
}

