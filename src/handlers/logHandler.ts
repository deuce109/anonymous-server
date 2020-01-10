
import { Request, Response } from 'express'
import Logger from '../logging'

export class LogHandler {

    public static getLogs = (req: Request, res: Response) => {
        const logs = Logger.read()
        res.send(logs)
    }

    public static getLogsByLevel = (req: Request, res: Response) => {
        const logs = Logger.read(req.params.type)
        res.send(logs)
    }
}
