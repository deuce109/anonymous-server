import { readFileSync } from 'fs'
import { Request, Response } from 'express'

export class LogHandler {
    public static getLogs =  async (req: Request, res: Response) => {
        const logs = readFileSync(`logs/all.log`)
        res.send(logs)
    }

    public static getLogsByLevel =  async (req: Request, res: Response) => {
        const logs = readFileSync(`logs/${req.params.type}.log`)
        res.send(logs)
      }
}
