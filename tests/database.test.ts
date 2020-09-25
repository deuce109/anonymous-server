import { IDatabase, createDatabase } from '../src/database'
import { createSandbox, SinonSpy } from 'sinon'
import { sleep, guid } from '../src/utils'
import { SQLiteDatabase } from '../src/database/sqlite'
import { IIntermediary } from '../src/types'

describe('Database test suite', () => {
    describe('Mock datbase tests', () => {
        let database: IDatabase
        const sandbox = createSandbox()

        afterEach(() => {
            sandbox.restore()
        })

        let id: string

        it('Should create a dastabase with the given connection string', () => {
            database = createDatabase('mock')

            expect(database.connectionString).toBe('')
            expect(database.type).toBe('mock')
        })

        it('Should create undefined database if there is an error', () => {
            const newDatabase = createDatabase('l;jksadf;lkjafdsj;asfd;lkj')
            expect(newDatabase).toBe(undefined)
        })

        it('Should check the datbase connection when the ping function is called', () => {
            const spy: SinonSpy = sandbox.spy(database, 'ping')
            const value = spy()
            expect(value).toBe(true)
        })

        it('Should call the callback when the ping function is called with a callback', () => {
            const spy: SinonSpy = sandbox.spy(database, 'ping')
            const callback = sandbox.spy(() => 'Good')
            const value = spy(callback)
            expect(callback.calledOnce).toBe(true)
            expect(value).toBe(true)
        })

        it('Should create a database entry when the insert function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'insert')
            const intermediary: IIntermediary = { id: '1', object: JSON.stringify({ mock: 'object', id: '1' }) }

            const result = await spy(intermediary, 'mock')
            expect(spy.calledWith(intermediary, 'mock')).toBe(true)
            expect(spy.calledOnce).toBe(true)
            expect(result).not.toBe('failed')
            id = result
        })

        it('Should retrieve a dastabase entry when the get function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'get')
            const testObject = await spy('mock', id)
            expect(spy.calledWith('mock', id)).toBe(true)
            expect(spy.calledOnce).toBe(true)
            expect(JSON.parse(testObject.object)).toStrictEqual({ id: '1', mock: 'object' })
        })

        it('Should retrieve all database objects when the getAll function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'getAll')
            const data = await spy('mock')
            expect(data.length).toBe(1)
            expect(spy.calledOnce).toBe(true)
        })

        it('Should update a database entry when the update function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'update')
            const success = await spy('mock', id, { mock2: 'object' })
            expect(spy.calledOnce).toBe(true)
            expect(spy.calledWith('mock', id, { mock2: 'object' })).toBe(true)
            expect(success).toBe('ok')
        })

        it('Should overwrite an existing database enytry when the overwrite function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'overwrite')
            const success = await spy('mock', id, { id: '1', mock: 'object' })
            expect(spy.calledOnce).toBe(true)
            expect(spy.calledWith('mock', id, { id: '1', mock: 'object' })).toBe(true)
            expect(success).toBe('ok')

        })

        it('Should delete a database entry when the delete function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'delete')
            const intermediary: IIntermediary = { id: guid(), object: JSON.stringify({ id: '2', mock: 'object' }) }
            const success = await database.insert(intermediary, 'mock')

            expect(success).not.toBe('failed')
            const result = await spy('mock', success)

            expect(result).not.toBe('failed')
        })

        it('Should delete all objects when the function delAll is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'delAll')
            const result = await spy('mock')
            expect(result).toBe('ok')
            expect(spy.calledOnce).toBe(true)
        })
    })


    describe('Redis database tests', () => {
        const database: IDatabase = createDatabase('redis://localhost:6380')
        const sandbox = createSandbox()

        beforeAll(async (done) => {
            while (!database.ping()) {
                await sleep(100)
            }
            done()
        })

        afterEach(() => {
            sandbox.restore()
        })

        let id: string

        it('Should create a dastabase with the given connection string', () => {


            expect(database.connectionString).toBe('redis://localhost:6380')
            expect(database.type).toBe('redis')
        })

        it('Should create undefined database if there is an error', () => {
            const newDatabase = createDatabase('l;jksadf;lkjafdsj;asfd;lkj')
            expect(newDatabase).toBe(undefined)
        })

        it('Should check the datbase connection when the ping function is called', () => {
            const spy: SinonSpy = sandbox.spy(database, 'ping')
            const value = spy()
            expect(value).toBe(true)
        })

        it('Should call the callback when the ping function is called with a callback', () => {
            const spy: SinonSpy = sandbox.spy(database, 'ping')
            const callback = sandbox.spy(() => 'Good')
            const value = spy(callback)
            expect(callback.calledOnce).toBe(true)
            expect(value).toBe(true)
        })

        it('Should create a database entry when the insert function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'insert')

            const intermediary: IIntermediary = { id: '1', object: JSON.stringify({ mock: 'object', id: '1' }) }

            const result = await spy(intermediary, 'mock')
            expect(spy.calledWith(intermediary, 'mock')).toBe(true)
            expect(spy.calledOnce).toBe(true)
            expect(result).not.toBe('failed')
            id = result
        })

        it('Should retrieve a dastabase entry when the get function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'get')
            const testObject = await spy('mock', id)
            expect(spy.calledWith('mock', id)).toBe(true)
            expect(spy.calledOnce).toBe(true)
            expect(JSON.parse(testObject.object)).toStrictEqual({ id: '1', mock: 'object' })
        })

        it('Should retrieve all database objects when the getAll function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'getAll')
            const data = await spy('mock')
            expect(data.length).toBe(1)
            expect(spy.calledOnce).toBe(true)
        })

        it('Should update a database entry when the update function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'update')
            const success = await spy('mock', id, { mock2: 'object' })
            expect(spy.calledOnce).toBe(true)
            expect(spy.calledWith('mock', id, { mock2: 'object' })).toBe(true)
            expect(success).toBe('ok')
        })

        it('Should overwrite an existing database enytry when the overwrite function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'overwrite')
            const success = await spy('mock', id, { id: '1', mock: 'object' })
            expect(spy.calledOnce).toBe(true)
            expect(spy.calledWith('mock', id, { id: '1', mock: 'object' })).toBe(true)
            expect(success).toBe('ok')

        })

        it('Should delete a database entry when the delete function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'delete')
            const intermediary: IIntermediary = { id: guid(), object: JSON.stringify({ id: '2', mock: 'object' }) }
            const success = await database.insert(intermediary, 'mock')

            expect(success).not.toBe('failed')
            const result = await spy('mock', success)

            expect(result).not.toBe('failed')
        })

        it('Should delete all objects when the function delAll is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'delAll')
            const success = await spy('mock')
            expect(success).toBe('ok')
            expect(spy.calledOnce).toBe(true)
        })
    })

    describe('SQLite datbase tests', () => {
        let database: SQLiteDatabase
        let id: string
        const sandbox = createSandbox()

        jest.setTimeout(10000)

        afterEach(() => {
            sandbox.restore()
        })

        it('Should create a database with the given connection string', async () => {
            database = createDatabase(':memory:') as SQLiteDatabase

            expect(await database.initTable('mock')).toBe(true)
            expect(database.connectionString).toBe(':memory:')
            expect(database.type).toBe('sqlite')
        })

        it('Should create undefined database if there is an error', () => {
            const newDatabase = createDatabase('l;jksadf;lkjafdsj;asfd;lkj')
            expect(newDatabase).toBe(undefined)
        })

        it('Should check the datbase connection when the ping function is called', () => {
            const spy: SinonSpy = sandbox.spy(database, 'ping')
            const value = spy()
            expect(value).toBe(true)
        })

        it('Should call the callback when the ping function is called with a callback', () => {
            const spy: SinonSpy = sandbox.spy(database, 'ping')
            const callback = sandbox.spy(() => 'Good')
            const value = spy(callback)
            expect(callback.calledOnce).toBe(true)
            expect(value).toBe(true)
        })

        it('Should create a database entry when the insert function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'insert')
            const result = await spy({ mock: 'object', id: '1' }, 'mock')
            expect(spy.calledWith({ mock: 'object', id: '1' }, 'mock')).toBe(true)
            expect(spy.calledOnce).toBe(true)
            expect(result).not.toBe('failed')
            id = result
        })

        it('Should retrieve a dastabase entry when the get function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'get')
            const testObject = await spy('mock', id)
            expect(spy.calledWith('mock', id)).toBe(true)
            expect(spy.calledOnce).toBe(true)
            expect(JSON.parse(testObject.object)).toStrictEqual({ id: '1', mock: 'object' })
        })

        it('Should retrieve all database objects when the getAll function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'getAll')
            const data = await spy('mock')
            expect(data.length).toBe(1)
            expect(spy.calledOnce).toBe(true)
        })

        it('Should update a database entry when the update function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'update')
            const success = await spy('mock', id, { mock2: 'object' })
            expect(spy.calledOnce).toBe(true)
            expect(spy.calledWith('mock', id, { mock2: 'object' })).toBe(true)
            expect(success).toBe('ok')
        })

        it('Should overwrite an existing database enytry when the overwrite function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'overwrite')
            const success = await spy('mock', id, { id: '1', mock: 'object' })
            expect(spy.calledOnce).toBe(true)
            expect(spy.calledWith('mock', id, { id: '1', mock: 'object' })).toBe(true)
            expect(success).toBe('ok')

        })

        it('Should delete a database entry when the delete function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'delete')
            const success = await database.insert({ id: '2', mock: 'object' }, 'mock')

            expect(success).not.toBe('failed')
            const result = await spy('mock', success)

            expect(result).not.toBe('failed')
        })

        it('Should delete all objects when the function delAll is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'delAll')
            const status = await spy('mock')
            expect(status).toBe('ok')
            expect(spy.calledOnce).toBe(true)
        })
    })
})
