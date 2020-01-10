import { LogHandler, ConfigHandler, ServerHandler, ObjectHandler } from '../src/handlers'
import { Request, Response } from 'express'
import { createSandbox } from 'sinon'
import { createDatabase, MockDatabase } from '../src/database'
import { IConfig } from '../src/config'
import * as path from 'path'
import Logger from '../src/logging'
describe('Handler test suite', () => {



    describe('Log handler test suite', () => {

        const sandbox = createSandbox()

        Logger.path = './logs/test'

        let request: Request
        let response: Response
        const send = sandbox.spy((data?: any) => data)
        const status = sandbox.spy((code: number) => ({ send, code } as unknown as Response))
        beforeEach(() => {
            sandbox.restore()
        })

        it('Should read logs when the endpoint is called', () => {

            response = { send } as unknown as Response
            LogHandler.getLogs(request, response)
            expect(send.calledOnce).toBe(true)
            expect(send.calledWith(undefined)).toBe(false)
        })

        it('Should read given level of logs when endpoint is called with level', () => {

            request = { params: { type: 'info' } } as unknown as Request
            response = { send } as unknown as Response
            LogHandler.getLogsByLevel(request, response)
            expect(send.called).toBe(true)
            expect(send.calledWith(undefined)).toBe(false)
        })
    })

    describe('Config handler test suite', () => {

        const sandbox = createSandbox()

        Logger.path = './logs/test'

        let request: Request
        let response: Response
        const send = sandbox.spy((data?: any) => data)
        const status = sandbox.spy((code: number) => ({ send, code } as unknown as Response))
        beforeEach(() => {
            sandbox.restore()
        })

        const configHandler: ConfigHandler = new ConfigHandler(createDatabase('mock'))

        const config: IConfig = { appName: 'mock', id: '1', data: [] }

        it('Should insert a config when the insert endpoint is called', async () => {
            request = { body: config } as unknown as Request
            response = { send, status } as unknown as Response
            await configHandler.insertConfig(request, response)
            expect(status.calledWith(200)).toBe(true)
        })

        it('Should return a 409 when the insert endpoint is with an existing config', async () => {
            request = { body: config } as unknown as Request
            response = { send, status } as unknown as Response
            await configHandler.insertConfig(request, response)
            expect(status.calledWith(409)).toBe(true)
        })

        it('Should not insert a config when the insert endpoint is called with a bad config', async () => {
            request = { body: {} } as unknown as Request
            response = { send, status } as unknown as Response
            await configHandler.insertConfig(request, response)
            expect(status.calledWith(400)).toBe(true)
        })

        it('Should get a config by id', async () => {
            request = { params: { app: 'mock' } } as unknown as Request
            response = { send } as unknown as Response
            await configHandler.getConfigByApp(request, response)
            expect(send.called).toBe(true)
            expect(send.calledWith(config)).toBe(true)
        })

        it('Should get all configs when getAll is called', async () => {
            request = {} as unknown as Request
            response = { send } as unknown as Response

            await configHandler.getAllConfig(request, response)
            expect(send.calledWith({ result: [config] })).toBe(true)
        })

        it('Should overwrite a config when overwite is called', async () => {
            request = { params: { id: '1' }, body: { appName: 'Mock', id: '1', data: [] } } as unknown as Request
            response = { send, status } as unknown as Response
            await configHandler.overwrite(request, response)
            expect(status.calledWith(200)).toBe(true)
        })

        it('Should merge two configs when merge is called', async () => {
            request = { params: { id: '1' }, body: { appName: 'Mock', id: '1', data: [] } } as unknown as Request
            response = { send, status } as unknown as Response
            await configHandler.updateWithMerge(request, response)
            expect(status.calledWith(200)).toBe(true)
        })

        it('Should validate an object with a config when validate is called', async () => {
            request = { body: {}, params: { app: 'Mock' } } as unknown as Request
            response = { send } as unknown as Response
            await configHandler.validate(request, response)
            expect(send.calledWith({ valid: true })).toBe(true)
        })
    })

    describe('Server handler test suite', () => {

        const sandbox = createSandbox()

        Logger.path = './logs/test'

        let request: Request
        let response: Response
        const send = sandbox.spy((data?: any) => data)
        const status = sandbox.spy((code: number) => ({ send, code } as unknown as Response))
        beforeEach(() => {
            sandbox.restore()
        })

        const serverHandler: ServerHandler = new ServerHandler(createDatabase('mock'))
        const serverStart: number = Date.now()

        it('Should return a server health object when health is called', async () => {
            request = {} as unknown as Request
            response = { send } as unknown as Response
            await serverHandler.health(request, response)
            const expected = { serverStatus: 'Up', databaseStatus: 'Connected', databaseType: 'mock', serverUptime: Date.now() - serverStart }
            const actual = send.returnValues[0]
            expect(send.called).toBe(true)
            expect(actual.serverStatus).toBe(expected.serverStatus)
            expect(actual.databaseType).toBe(expected.databaseType)
            expect(actual.databaseStatus).toBe(expected.databaseStatus)
        })
    })

    describe('Object handler test suite', () => {

        const sandbox = createSandbox()

        const send = sandbox.spy((data?: any) => data)
        const status = sandbox.spy((code: number) => ({ send, code } as unknown as Response))

        const database = createDatabase('mock')

        const objectHandler: ObjectHandler = new ObjectHandler(database)
        const configHandler: ConfigHandler = new ConfigHandler(database)

        const config: IConfig = {
            appName: 'mock', id: '1', data: [
                { name: 'foo', type: 'string', encryption: 'none' },
                { name: 'bar', type: 'string', encryption: 'none' },
                { name: 'id', type: 'string', encryption: 'none' },
            ],
        }
        const testObject = { foo: 'foo', bar: 'bar', id: '2' }

        configHandler.insertConfig({ body: config } as unknown as Request, { send, status } as unknown as Response)


        Logger.path = './logs/test'

        let request: Request
        const response: Response = { send, status } as unknown as Response




        beforeEach(() => {
            sandbox.restore()
        })

        it('Should insert an object when insert is called', async () => {
            request = { body: testObject, params: { app: 'mock' } } as unknown as Request
            const result = await objectHandler.insert(request, response)
            expect(status.calledWith(200)).toBe(true)

        })

        it('Should conflict when insert is called with a preexisting object', async () => {
            request = { body: testObject, params: { app: 'mock' } } as unknown as Request
            const result = await objectHandler.insert(request, response)
            expect(status.calledWith(409)).toBe(true)
        })

        it('Should return a bad request if it can\'t find a config', async () => {
            request = { body: testObject, params: { app: 'mock2' } } as unknown as Request
            const result = await objectHandler.insert(request, response)
            expect(status.calledWith(400)).toBe(true)
        })

        it('Should update an exising object when updateWithMerge is called', async () => {
            const mergeObject = { foo: 'FOO' }
            request = { body: mergeObject, params: { app: 'mock', id: '2' } } as unknown as Request
            await objectHandler.updateWithMerge(request, response)
            expect(status.calledWith(200)).toBe(true)
        })

        it('Should return an array of objects when getAll is called', async () => {
            request = { params: { app: 'mock' } } as unknown as Request
            await objectHandler.getAll(request, response)
            expect(send.calledWith({ result: [{ data: { foo: 'FOO', bar: 'bar', id: '2' } }] })).toBe(true)
        })

        it('Should overwrite an existing database entry when the overwrite function is called', async () => {
            request = { params: { app: 'mock', id: '1' }, body: testObject } as unknown as Request
            await objectHandler.overwrite(request, response)
            expect(status.calledWith(200)).toBe(true)
        })

        it('Should delete an existing database entry when the delete function is called', async () => {
            request = { params: { app: 'mock', id: '1' } } as unknown as Request
            await objectHandler.delete(request, response)
            expect(status.calledWith(200)).toBe(true)
        })

        it('Should delete all database entries when the delete all function is called', async () => {
            request = { params: { app: 'mock' } } as unknown as Request
            await objectHandler.deleteAll(request, response)
            expect(status.calledWith(200)).toBe(true)
        })

        jest.mock('../src/database', () => ({
            createDatabase,
            MockDatabase: {
                insert: () => null,
                overwrite: () => false,
                updateWithMerge: () => false,
                delete: () => false,
                deleteAll: () => false,
            },
        }))

        it('Should return a 500 if the database errors on any endpoint', async () => {
            request = { params: { app: 'mock' }, body: testObject } as unknown as Request
            await objectHandler.delete(request, response)
            expect(status.calledWith(500)).toBe(true)
            await objectHandler.insert(request, response)
            expect(status.calledWith(500)).toBe(true)
            await objectHandler.deleteAll(request, response)
            expect(status.calledWith(500)).toBe(true)
            await objectHandler.overwrite(request, response)
            expect(status.calledWith(500)).toBe(true)
            await objectHandler.updateWithMerge(request, response)
            expect(status.calledWith(500)).toBe(true)
        })

        it('Should returna 500 if it fails inserting a cofig', async () => {
            request = { body: config } as unknown as Request
            await configHandler.insertConfig(request, response)
            expect(status.calledWith(500)).toBe(true)
        })
    })
})