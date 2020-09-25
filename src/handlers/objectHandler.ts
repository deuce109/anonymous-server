import { Request, Response } from 'express'
import { IDatabase } from '../database'
import { IConfig, decryptBasedOnConfig, encryptBasedOnConfig, validateDataWithConfig } from '../config'
import { IIntermediary } from '../types'
import { guid } from '../utils'

export class ObjectHandler {
  constructor(db: IDatabase) {
    this.db = db
  }
  private db: IDatabase
  public async getAll(request: Request, response: Response): Promise<void> {

    const { app } = request.params
    const intermediaries: IIntermediary[] = await this.db.getAll(app)
    const configIntermediaries: IIntermediary[] = await this.db.getAll('config')
    const configs: IConfig[] = configIntermediaries.map((configIntermediary: IIntermediary) => JSON.parse(configIntermediary.object))
    const config = configs.find((configItem: IConfig) => configItem.appName === app)
    const objects: any[] = intermediaries.map((intermediary: IIntermediary) => JSON.parse(intermediary.object))
    const decrpytedObjects: any[] = objects.map((object: any) => decryptBasedOnConfig(object, config).data)
    response.status(200).send(decrpytedObjects)
  }

  public async insert(request: Request, response: Response): Promise<void> {
    const object: any = request.body
    const configs: IConfig[] = (await this.db.getAll('config')).map((configIntermediary) => JSON.parse(configIntermediary.object))
    const config: IConfig = configs.find((internConfig) => internConfig.appName === request.params.app) || null

    if (config === null || typeof config === 'undefined') {
      response.status(400).send()
      return
    }
    const intermediary: IIntermediary = { id: object.id || guid(), object: JSON.stringify(encryptBasedOnConfig(object, config).data) }

    const result = await this.db.insert(intermediary, request.params.app)
    if (result === 'failed') {
      response.status(500).send()
    } else if (result === 'conflict') {
      response.status(409).send()
    } else {
      response.status(200).send(intermediary.id)
    }
  }

  public async update(request: Request, response: Response): Promise<void> {
    const object = request.body
    if (object === null) {
      response.status(400).send()
    }
    const result = await this.db.update(request.params.app, object.id, { id: object.id, object: JSON.stringify(object) })

    if (result === 'failed') {
      response.status(500).send()
    } else {
      response.status(200).send()
    }

  }

  public async overwrite(request: Request, response: Response): Promise<void> {
    const object: any = request.body
    const intermediary: IIntermediary = { id: object.id || guid(), object: JSON.stringify(object) }
    const result = await this.db.overwrite(request.params.app, object.id, intermediary)
    if (result === 'failed') {
      response.status(500).send()
    } else {
      response.status(200).send(intermediary.id)
    }
  }

  public async delete(request: Request, response: Response): Promise<void> {
    const result = await this.db.delete(request.params.app, request.params.id)
    if (result === 'failed') {
      response.status(500).send()
    } else {
      response.status(200).send()
    }
  }

  public async deleteAll(request: Request, response: Response): Promise<void> {
    const result = await this.db.delAll(request.params.app)

    if (result === 'failed') {
      response.status(500).send()
    } else {
      response.status(200).send()
    }
  }

  public async getById(request: Request, response: Response): Promise<void> {
    const intermediary: IIntermediary = await this.db.get(request.params.app, request.params.id)
    const object = JSON.parse(intermediary.object)
    const configs: IConfig[] = (await this.db.getAll('config')).map((configIntermediary) => JSON.parse(configIntermediary.object))
    const config: IConfig = configs.find(config => config.appName === request.params.app)
    const decrpytedObject = decryptBasedOnConfig(object, config).data

  }

}
