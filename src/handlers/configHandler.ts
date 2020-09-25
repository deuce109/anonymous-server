import { IDatabase } from '../database'
import { Request, Response } from 'express'
import { IConfig, verifyConfig, validateDataWithConfig } from '../config'
import { IIntermediary } from '../types'
import { guid } from '../utils'

export class ConfigHandler {
    constructor(db: IDatabase) {
        this.db = db
    }

    public getAllConfig = async (req: Request, res: Response) => {
        const intermediaries = await this.db.getAll('config')
        const configs = intermediaries.map((intermediary: IIntermediary) => JSON.parse(intermediary.object))
        const result = { result: configs }
        res.send(result)
    }

    public getConfigByApp = async (req: Request, res: Response) => {
        const result: IConfig[] = (await this.db.getAll('config')).map((intermediary: IIntermediary) => JSON.parse(intermediary.object))
        const config: IConfig = result.find((item: IConfig) => item.appName === req.params.app)
        res.send(config)
    }

    public insertConfig = async (req: Request, res: Response) => {
        if (!verifyConfig(req.body)) {
            res.status(400).send()
            return
        }
        const config: IConfig = req.body
        const intermediary: IIntermediary = { id: config.id || guid(), object: JSON.stringify(config) }
        const result = await this.db.insert(intermediary, 'config')

        if (result === 'conflict') {
            res.status(409).send()
        } else if (result === 'failed') {
            res.status(500).send()
        } else {
            res.status(200).send()
        }
    }

    public overwrite = async (req: Request, res: Response) => {

        const config: IConfig = req.body
        const intermediary: IIntermediary = { id: config.id || guid(), object: JSON.stringify(config) }
        const success = await this.db.overwrite(
            'config',
            req.params.id,
            intermediary,
        )
        res.status(success ? 200 : 500).send()
    }

    public updateWithMerge = async (req: Request, res: Response) => {
        const config: IConfig = req.body
        const intermediary: IIntermediary = { id: config.id || guid(), object: JSON.stringify(config) }
        const success = await this.db.update(
            'config',
            req.params.id,
            intermediary,
        )
        res.status(success ? 200 : 500).send()
    }

    public validate = async (req: Request, res: Response) => {
        const intermedaries: IIntermediary[] = await this.db.getAll('config')
        const configs: IConfig[] = intermedaries.map((intermediary: IIntermediary) => JSON.parse(intermediary.object))
        const config: IConfig = configs.find((item: IConfig) => item.appName === req.params.app)
        const valid = validateDataWithConfig(req.body, config)
        res.send({ valid })
    }

    private db: IDatabase
}
