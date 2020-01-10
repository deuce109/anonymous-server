import { calculateUptime } from '../utils'
import { IDatabase } from '../database'
import { Request, Response } from 'express'

export class ServerHandler {
    constructor(db: IDatabase) {
        this.db = db
        this.timeStarted = Date.now()
    }

    public health = async (req: Request, res: Response) => {
        const health: any = {}
        health.serverStatus = 'Up'
        health.serverUptime = calculateUptime(this.timeStarted)
        health.databaseStatus = await this.db.ping() ? 'Connected' : 'Disconnected'
        health.databaseType = this.db.type
        res.send(health)
    }

    public timeStarted: number
    public db: IDatabase
}
