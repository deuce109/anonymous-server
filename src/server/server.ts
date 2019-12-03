import { IServer } from './index'
import { Express } from 'express'
import { IDatabase } from '../database'
import express = require('express')
import { log } from '../utils'
import { ObjectHandler, ServerHandler, LogHandler, ConfigHandler } from '../handlers'

export class ExpressServer implements IServer {
  constructor(app: Express, port: number, db: IDatabase) {

    this.objectHandler = new ObjectHandler(db)
    this.serverHandler = new ServerHandler(db)
    this.configHandler = new ConfigHandler(db)

    // Allows us to access request.body as a JSON Object
    app.use(express.json())

    // Get all items for a specified app
    app.get('/:app/objects', this.objectHandler.getAll)

    // Get specified item for a specified app
    app.get('/:app/objects/:id', this.objectHandler.getById)

    // Overwrite a specific item for a specified app
    app.put('/:app/objects/:id', this.objectHandler.overwrite)

    // Update a specific item for a specified app
    app.patch('/:app/objects/:id', this.objectHandler.updateWithMerge)

    // Add a specific item for a specified app
    app.post('/:app/objects', this.objectHandler.insert)

    // Delete a specific item for a specified app
    app.delete('/:app/objects/:id', this.objectHandler.delete)

    // Health info for the data controller
    app.get('/health', this.serverHandler.health )

    // Download server logs
    app.get('/logs/:type', LogHandler.getLogsByLevel )

    app.get('/logs', LogHandler.getLogs )

    app.get('/config', this.configHandler.getAllConfig )

    app.get('/config/:app', this.configHandler.getConfigByApp)

    app.post('/config', this.configHandler.insertConfig)

    // Enable if not in production
    if (process.env.NODE_ENV !== 'production') {
      // Endpoint to clear datbaase for a specific app
      app.delete('/:app/objects', this.objectHandler.deleteAll )

      app.get('/:app/validate/:id', this.configHandler.validate)
    }

    this.server = app
    this.port = port
    this.db = db
  }

  public listen(callback?: () => void) {
    const defaultLog = () => {
      log('info', 'Server running on port ' + this.port)
    }
    this.server.listen(this.port, callback || defaultLog)
  }

  public server: Express
  public port: number
  public db: IDatabase
  public timeStarted: number
  public objectHandler: ObjectHandler
  public serverHandler: ServerHandler
  public configHandler: ConfigHandler

}
