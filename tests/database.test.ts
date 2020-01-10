import { IDatabase, createDatabase } from '../src/database'
import { createSandbox, SinonSpy } from 'sinon'
import { sleep } from '../src/utils'

describe('Database test suite', () => {
    describe('Mock datbase tests', () => {
        let database: IDatabase
        const sandbox = createSandbox()

        afterEach(() => {
            sandbox.restore()
        })

        it('Should create a dastabase with the given connection string', () => {
            database = createDatabase('mock')

            expect(database.connectionString).toBe('')
            expect(database.type).toBe('mock')
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
            expect(result).toBe('ok')
        })

        it('Should retrieve a dastabase entry when the get function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'get')
            const testObject = await spy('mock', '1')
            expect(spy.calledWith('mock', '1')).toBe(true)
            expect(spy.calledOnce).toBe(true)
            expect(testObject).toStrictEqual({ id: '1', mock: 'object' })
        })

        it('Should retrieve all database objects when the getAll function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'getAll')
            const data = await spy('mock')
            expect(data.length).toBe(1)
            expect(spy.calledOnce).toBe(true)
        })

        it('Should update a database entry when the update function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'update')
            const success = await spy('mock', '1', { mock2: 'object' })
            expect(spy.calledOnce).toBe(true)
            expect(spy.calledWith('mock', '1', { mock2: 'object' })).toBe(true)
            expect(success).toBe(true)
        })

        it('Should overwrite an existing database enytry when the overwrite function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'overwrite')
            const success = await spy('mock', '1', { id: '1', mock: 'object' })
            expect(spy.calledOnce).toBe(true)
            expect(spy.calledWith('mock', '1', { id: '1', mock: 'object' })).toBe(true)
            expect(success).toBe(true)

        })

        it('Should delete a database entry when the delete function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'delete')
            const success = await database.insert({ id: '2', mock: 'object' }, 'mock')

            expect(success).toBe('ok')
            const data = await spy('mock', '2')

            expect(data.length).toBe(1)
            expect(data).toStrictEqual([{ mock: 'object', id: '1' }])
        })

        it('Should delete all objects when the function delAll is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'delAll')
            const length = await spy('mock')
            expect(length).toBe(0)
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



        it('Should create a dastabase with the given connection string', () => {


            expect(database.connectionString).toBe('redis://localhost:6380')
            expect(database.type).toBe('redis')
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
            expect(value).toBe('Good')
        })

        it('Should create a database entry when the insert function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'insert')
            const result = await spy({ mock: 'object', id: '1' }, 'mock')
            expect(spy.calledWith({ mock: 'object', id: '1' }, 'mock')).toBe(true)
            expect(spy.calledOnce).toBe(true)
            expect(result).toBe('ok')
        })

        it('Should retrieve a dastabase entry when the get function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'get')
            const testObject = await spy('mock', '1')
            expect(spy.calledWith('mock', '1')).toBe(true)
            expect(spy.calledOnce).toBe(true)
            expect(testObject).toStrictEqual({ id: '1', mock: 'object' })
        })

        it('Should retrieve all database objects when the getAll function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'getAll')
            const data = await spy('mock')
            expect(data.length).toBe(1)
            expect(spy.calledOnce).toBe(true)
        })

        it('Should update a database entry when the update function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'update')
            const success = await spy('mock', '1', { mock2: 'object' })
            expect(spy.calledOnce).toBe(true)
            expect(spy.calledWith('mock', '1', { mock2: 'object' })).toBe(true)
            expect(success).toBe('ok')
        })

        it('Should overwrite an existing database enytry when the overwrite function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'overwrite')
            const success = await spy('mock', '1', { id: '1', mock: 'object' })
            expect(spy.calledOnce).toBe(true)
            expect(spy.calledWith('mock', '1', { id: '1', mock: 'object' })).toBe(true)
            expect(success).toBe('ok')

        })

        it('Should delete a database entry when the delete function is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'delete')
            const success = await database.insert({ id: '2', mock: 'object' }, 'mock')

            expect(success).toBe('ok')
            const result = await spy('mock', '2')
            expect(result).toBe(true)
        })

        it('Should delete all objects when the function delAll is called', async () => {
            const spy: SinonSpy = sandbox.spy(database, 'delAll')
            const result = await spy('mock')
            expect(result).toBe(true)
            expect(spy.calledOnce).toBe(true)
        })
    })

})
