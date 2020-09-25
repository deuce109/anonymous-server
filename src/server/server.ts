import * as express from 'express'
import { Express } from 'express'
import * as socketio from 'socket.io'
import { Server as HttpServer } from 'http'
import { IDatabase, createDatabase } from '../database'
import { ObjectHandler, ConfigHandler, LogHandler, ServerHandler } from '../handlers'
import { IServer } from '.'
import Logger from '../logging'

export class Server implements IServer {


    constructor(dbConnectionString: string) {

        this.listen = this.listen.bind(this)

        this.emitSocketEvent = this.emitSocketEvent.bind(this)

        this.addSocketListener = this.addSocketListener.bind(this)

        this.app = express()

        this.server = new HttpServer(this.app)

        this.io = socketio(this.server)

        // Create database based on connection string
        this.db = createDatabase(dbConnectionString)

        // Handler for dealing with anonymous objects
        this.objectHandler = new ObjectHandler(this.db)
        this.configHandler = new ConfigHandler(this.db)
        this.serverHandler = new ServerHandler(this.db)

        // Read request bodies as JSON objects
        this.app.use(express.json())

        // Get all items for a specified app
        this.app.get('/:app/objects', this.objectHandler.getAll)

        // Get specified item for a specified app
        this.app.get('/:app/objects/:id', this.objectHandler.getById)

        // Overwrite a specific item for a specified app
        this.app.put('/:app/objects/:id', this.objectHandler.overwrite)

        // Update a specific item for a specified app
        this.app.patch('/:app/objects/:id', this.objectHandler.update)

        // Add a specific item for a specified app
        this.app.post('/:app/objects', this.objectHandler.insert)

        // Delete a specific item for a specified app
        this.app.delete('/:app/objects/:id', this.objectHandler.delete)

        // Health info for the data controller
        this.app.get('/health', this.serverHandler.health)

        // Download server logs
        this.app.get('/logs/:type', LogHandler.getLogsByLevel)

        this.app.get('/logs', LogHandler.getLogs)

        this.app.get('/config', this.configHandler.getAllConfig)

        this.app.get('/config/:app', this.configHandler.getConfigByApp)

        this.app.post('/config', this.configHandler.insertConfig)

        // Enable if not in production
        if (process.env.NODE_ENV !== 'production') {
            // Endpoint to clear datbaase for a specific app
            this.app.delete('/:app/objects', this.objectHandler.deleteAll)

            this.app.get('/:app/validate/:id', this.configHandler.validate)
        }
    }

    public use(middleware: (req, res, next?) => void) {
        this.app.use(middleware)
    }

    public listen(port: number, callback?: () => void): void {

        if (port === undefined || port < 0 || port > 65535) {
            throw new Error('port must be a valid number less than 65535 and greater than 0')
        }

        const defaultLog = () => { Logger.info(`Server listening on port ${port}`) }

        (callback || defaultLog)()
        this.app.listen(port)
    }

    public addSocketListener(name: string, handler: (...args: any[]) => void): socketio.Namespace {
        return this.io.on(name, handler)
    }

    public emitSocketEvent(name: string, ...data: any[]): socketio.Namespace {
        return this.io.emit(name, ...data)
    }

    public port: number
    private objectHandler: ObjectHandler
    private configHandler: ConfigHandler
    private serverHandler: ServerHandler
    private app: Express
    private server: HttpServer
    private io: socketio.Server
    public db: IDatabase

}