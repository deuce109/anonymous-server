import { Request, Response } from 'express'
import { IDatabase } from '../database'
import { IConfig, decryptBasedOnConfig, encryptBaseOnConfig } from '../config'

export class ObjectHandler {
  constructor(db: IDatabase) {
    this.db = db
  }
  private db: IDatabase
  public getAll = async (req: Request, res: Response) => {
    const configs = await this.db.getAll('config')

    const config = configs.find((item) => item.appName === req.params.app)

    let items = await this.db.getAll(req.params.app)

    items = items.map((item) => {
      return decryptBasedOnConfig(item, config)
    })

    res.send({ result: items })
  }

  public getById = async (req: Request, res: Response) => {
    let result = (await this.db.get(req.params.app, req.params.id)) || null
    const config: IConfig = (await this.db.getAll('config')).find((item) => item.appName === req.params.app)
    result = result ? decryptBasedOnConfig(result, config) : null
    res.status(result != null ? 200 : 500).send(result)
  }

  public overwrite = async (req: Request, res: Response) => {
    const success = await this.db.overwrite(
      req.params.app,
      req.params.id,
      req.body,
    )
    res.status(success ? 200 : 500).send()
  }

  public updateWithMerge = async (req: Request, res: Response) => {
    const success = await this.db.update(
      req.params.app,
      req.params.id,
      req.body,
    )
    res.status(success ? 200 : 500).send()
  }

  public insert = async (req: Request, res: Response) => {
    const config: IConfig = (await this.db.getAll('config')).find((item) => item.appName === req.params.app)
    if (config === undefined || config === null) {
      res.status(400).send()
      return
    }
    const encryptedData: any = encryptBaseOnConfig(req.body, config)

    const result = await this.db.insert(encryptedData.data, req.params.app)
    if (result === 'conflict') {
      res.status(409).send()
    } else if (result === 'ok') {
      res.status(200).send()
    } else {
      res.status(500).send()
    }
  }

  public delete = async (req: Request, res: Response) => {
    const success: boolean = await this.db.delete(
      req.params.app,
      req.params.id,
    )
    res.status(success ? 200 : 500).send()
  }

  public deleteAll = async (req: Request, res: Response) => {
    const success = await this.db.delAll(req.params.app)
    res.status(success ? 200 : 500).send()
  }

}
