import { IDatabase } from './'
import { mergeObjectsWithOverwrite } from '../utils'
export class MockDatabase implements IDatabase {
    public type: string = 'mock'
    public connectionString: string = ''
    public get = async (appName: string, id: string) => {
        return this.data[appName].find((object) => object.id === id)
    }

    public insert = async (object: any, app: string) => {
        if (this.data[app] !== undefined && this.data[app].includes(object)) {
            return 'conflict'
        }
        if (this.data[app] === undefined) {
            this.data[app] = []
        }
        this.data[app].push(object)
        return 'ok'
    }

    public update = async (appName: string, key: string, object: any) => {
        const index = this.data[appName].findIndex((item: any) => item.id === key)
        const newObject = mergeObjectsWithOverwrite(this.data[appName][index], object)
        this.data[appName][index] = newObject
        return true
    }

    public delete = async (appName: string, key: string) => {
        const index = this.data[appName].findIndex((item: any) => item.id === key)
        this.data[appName].splice(index, 1)
        return this.data[appName]
    }

    public getAll = async (appName: string) => this.data[appName]

    public delAll = async (appName: string) => {
        this.data[appName] = []
        return this.data[appName].length
    }

    public overwrite = async (appName: string, key: string, object: any) => {
        const index = this.data[appName].findIndex((item: any) => item.id === key)
        this.data[appName][index] = object
        return true
    }

    public ping = (callback?: () => string) => {
        if (typeof callback === 'function') { callback() } return true
    }
    private data: { [key: string]: any[] } = {}
}