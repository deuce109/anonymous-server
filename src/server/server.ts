import * as express from 'express'
import { Express } from 'express'
import * as socketio from 'socket.io'
import { IDatabase, createDatabase } from '../database'
import { ObjectHandler, ConfigHandler, LogHandler, ServerHandler } from '../handlers'
import { IServer } from '.'
import { log } from '../utils'


export class Server implements IServer {

    constructor(dbConnectionString: string) {

        this.app = express()

        const server = require('http').Server(this.app)

        this.io = socketio(server)

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
        this.app.patch('/:app/objects/:id', this.objectHandler.updateWithMerge)

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

    public listen(port: number, callback?: () => void) {

        const defaultLog = () => { log('info', `server listening on port ${port}`) }

        const cb = callback || defaultLog

        this.io.listen(port)
        cb()
    }

    public addSocketListener(name: string, handler: (...args: any[]) => void) {
        this.io.on(name, handler)
    }

    public emitSocketEvent(name: string, ...data: any[]) {
        this.io.emit(name, ...data)
    }

    public port: number
    private objectHandler: ObjectHandler
    private configHandler: ConfigHandler
    private serverHandler: ServerHandler
    private app: Express
    private io: socketio.Server
    public db: IDatabase

}