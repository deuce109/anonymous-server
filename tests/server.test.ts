
import { MockServer, IServer, Server } from '../src/server'
import { createSandbox, SinonSpy } from 'sinon'

const socketIOClient = require('socket.io-client')

describe('Server test suite', () => {

    describe('MockServer test suite', () => {
        const sandbox = createSandbox()

        let server: IServer
        let spy: SinonSpy

        beforeEach(() => {
            server = new MockServer()
            spy = sandbox.spy(server, 'listen')
        })

        afterEach(() => {
            sandbox.restore()
        })

        it('Should error when  the server function listen is called with an undefined port number', () => {
            try {
                spy(undefined)
            } catch (e) {
                expect(e).not.toBe(null)
            }

            expect(spy).toThrowError('port must be a valid number less than 65535 and greater than 0')
        })

        it('Should error when  the server function listen is called with a port number less than 0', () => {
            try {
                spy(-1)
            } catch (e) {
                expect(e).not.toBe(null)
            }

            expect(spy).toThrowError('port must be a valid number less than 65535 and greater than 0')
        })

        it('Should error when  the server function listen is called with a port number greater than 65535', () => {
            try {
                spy(65536)
            } catch (e) {
                expect(e).not.toBe(null)
            }

            expect(spy).toThrowError('port must be a valid number less than 65535 and greater than 0')
        })

        it('Should call listen callback when called with valid port number and callback', () => {
            const callback = sandbox.spy(() => { })
            spy(1, callback)
            expect(spy.calledWith(1, callback)).toBe(true)
            expect(callback.calledOnce).toBe(true)
            expect(spy.calledOnce).toBe(true)
        })

        it('Should not call listen callback when called with invalid port number and callback', () => {
            const callback = sandbox.spy(() => { })
            try {
                spy(65536, callback)
            } catch (e) {
                expect(e).not.toBe(null)
            }
            expect(spy.calledWith(65536, callback)).toBe(true)
            expect(callback.calledOnce).toBe(false)
            expect(spy.calledOnce).toBe(true)
            expect(spy).toThrowError('port must be a valid number less than 65535 and greater than 0')
        })

        it('Should listen and assign port number when the server function listen is called', () => {
            server.listen(1)
            expect(spy.callCount).toBe(1)
            expect(server.port).toBe(1)
        })

        it('Should create a new database when the constructor is called', () => {
            expect(server.db.type).toBe('mock')
            expect(typeof server.db).not.toBe('undefined')
            expect(typeof server.db).toBe('object')
        })
    })

    describe('Server test suite', () => {
        const sandbox = createSandbox()

        const event = jest.fn(() => { })

        let server: Server
        let spy: SinonSpy

        server = new Server('mock')
        beforeEach(() => {
            spy = sandbox.spy(server, 'listen')
        })

        afterEach(() => {
            sandbox.restore()
        })

        it('Should error when  the server function listen is called with an undefined port number', () => {

            try {
                spy(undefined)
            } catch (e) {
                expect(e).not.toBe(null)
            }

            expect(spy).toThrowError('port must be a valid number less than 65535 and greater than 0')
        })

        it('Should error when  the server function listen is called with a port number less than 0', () => {
            try {
                spy(-1)
            } catch (e) {
                expect(e).not.toBe(null)
            }

            expect(spy).toThrowError('port must be a valid number less than 65535 and greater than 0')
        })

        it('Should error when  the server function listen is called with a port number greater than 65535', () => {
            try {
                spy(65536)
            } catch (e) {
                expect(e).not.toBe(null)
            }

            expect(spy).toThrowError('port must be a valid number less than 65535 and greater than 0')
        })

        it('Should call listen callback when called with valid port number and callback', () => {
            const callback = sandbox.spy(() => { })
            spy(3030, callback)
            expect(spy.calledWith(3030, callback)).toBe(true)
            expect(callback.calledOnce).toBe(true)
            expect(spy.calledOnce).toBe(true)
        })

        it('Should not call listen callback when called with invalid port number and callback', () => {
            const callback = sandbox.spy(() => { })
            try {
                spy(65536, callback)
            } catch (e) {
                expect(e).not.toBe(null)
            }
            expect(spy.calledWith(65536, callback)).toBe(true)
            expect(callback.calledOnce).toBe(false)
            expect(spy.calledOnce).toBe(true)
            expect(spy).toThrowError('port must be a valid number less than 65535 and greater than 0')
        })

        it('Should listen and assign port number when the server function listen is called', () => {
            server.listen(3031)
            expect(spy.callCount).toBe(1)
            expect(spy.calledWith(3031)).toBe(true)
        })

        it('Should create a new database when the constructor is called', () => {
            expect(server.db.type).toBe('mock')
            expect(typeof server.db).not.toBe('undefined')
            expect(typeof server.db).toBe('object')
        })

        it('Should add a socket listener when the addSocketListener function is called and trigger when emitSocketEvent is called', () => {


            spy = sandbox.spy(server, 'addSocketListener')
            spy('test', event)
            expect(spy.calledWith('test', event)).toBe(true)

        })

        it('Should trigger event when emitSocketEvent is called', () => {

            const client = socketIOClient('localhost:8080')
            const clientSpy = sandbox.spy(() => { })
            client.on('test', clientSpy)
            spy = sandbox.spy(server, 'emitSocketEvent')
            server.emitSocketEvent('test')
            expect(spy.calledWith('test')).toBe(true)
            expect(spy.called).toBe(true)
        })
    })
})
