import { IDatabase } from './'
import { mergeObjectsWithOverwrite } from '../utils'
import { IIntermediary } from '../types'
export class MockDatabase implements IDatabase {

    constructor() {
        this.get = this.get.bind(this)
        this.insert = this.insert.bind(this)
        this.update = this.update.bind(this)
        this.delete = this.delete.bind(this)
        this.getAll = this.getAll.bind(this)
        this.delAll = this.delAll.bind(this)
        this.overwrite = this.overwrite.bind(this)
    }

    public async get(appName: string, id: string): Promise<IIntermediary> {
        return this.data[`${appName}-${id}`]
    }
    public async insert(object: IIntermediary, app: string): Promise<string> {
        const keys: string[] = Object.keys(this.data)
        if (keys.includes(`${app}-${object.id}`)) {
            return 'conflict'
        }
        this.data[`${app}-${object.id}`] = object
        return object.id
    }
    public async update(appName: string, id: string, object: IIntermediary): Promise<string> {
        const oldObject: IIntermediary = this.data[`${appName}-${id}`]
        console.log(`${appName}-${id}`)
        console.log(oldObject)
        const newObject: IIntermediary = mergeObjectsWithOverwrite(oldObject, object)
        this.data[`${appName}-${id}`] = newObject
        return 'ok'
    }
    public async delete(appName: string, id: string): Promise<string> {
        delete this.data[`${appName}-${id}`]
        return 'ok'
    }
    public async getAll(appName: string): Promise<IIntermediary[]> {
        let intermediaries = Object.keys(this.data).map((key) => {
            if (key.match(new RegExp(`${appName}-.*`))) {
                return this.data[key]
            }
        })

        intermediaries = intermediaries.filter((intermediary) => {
            return (typeof intermediary !== 'undefined' && intermediary !== null)
        })

        return intermediaries
    }
    public async delAll(appName: string): Promise<string> {
        const { data } = this
        Object.keys(data).forEach((key) => {
            if (key.match(new RegExp(`${appName}-.*`))) {
                delete data[key]
            }
        })
        this.data = data
        return 'ok'
    }
    public async overwrite(appName: string, id: string, object: IIntermediary): Promise<any> {
        this.data[`${appName}-${id}`] = object
        return 'ok'
    }
    public type: string = 'mock'
    public connectionString: string = ''


    public ping = (callback?: () => string) => {
        if (typeof callback === 'function') {
            callback()
        }
        return true
    }
    private data: { [key: string]: IIntermediary } = {}
}