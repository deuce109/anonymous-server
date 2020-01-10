import { IDatabase } from '../database'
import { Request, Response } from 'express'
import { IConfig, verifyConfig, validateDataWithConfig } from '../config'

export class ConfigHandler {
    constructor(db: IDatabase) {
        this.db = db
    }

    public getAllConfig = async (req: Request, res: Response) => {
        const result = { result: await this.db.getAll('config') }
        res.send(result)
    }

    public getConfigByApp = async (req: Request, res: Response) => {
        const result: IConfig[] = await this.db.getAll('config')
        const config: IConfig = result.find((item: IConfig) => item.appName === req.params.app)
        res.send(config)
    }

    public insertConfig = async (req: Request, res: Response) => {
        if (!verifyConfig(req.body)) {
            res.status(400).send()
            return
        }
        const result = await this.db.insert(req.body, 'config')

        if (result === 'conflict') {
            res.status(409).send()
        } else if (result === 'ok') {
            res.status(200).send()
        } else {
            res.status(500).send()
        }
    }

    public overwrite = async (req: Request, res: Response) => {
        const success = await this.db.overwrite(
            'config',
            req.params.id,
            req.body,
        )
        res.status(success ? 200 : 500).send()
    }

    public updateWithMerge = async (req: Request, res: Response) => {
        const success = await this.db.update(
            'config',
            req.params.id,
            req.body,
        )
        res.status(success ? 200 : 500).send()
    }

    public validate = async (req: Request, res: Response) => {
        const config: IConfig = (await this.db.getAll('config')).find((item) => item.appName === req.params.app)
        const valid = validateDataWithConfig(req.body, config)
        res.send({ valid })
    }

    private db: IDatabase
}
