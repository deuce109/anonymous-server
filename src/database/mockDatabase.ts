import { IDatabase } from './'
export class MockDatabase implements IDatabase {
    public type: string = 'mock'; public connectionString: string = ''
    public get: (appName: string, id: string) => Promise<any>
    public insert: (object: any, app: string) => Promise<any>
    public update: (appName: string, key: string, object: any) => Promise<any>
    public delete: (appName: string, key: string) => Promise<any>
    public getAll: (appName: string) => Promise<any[]>
    public delAll: (appName: string) => Promise<any>
    public overwrite: (appName: string, key: string, object: any) => Promise<any>
    public ping: (callback?: () => string) => any


}