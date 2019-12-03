import { error } from 'console'
import { appendFileSync } from 'fs'
import { IDataDefinition, IConfig } from '../types'
import { AES, SHA2 } from '../crypto'
export function sleep(ms): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function guid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // tslint:disable-next-line: one-variable-per-declaration no-bitwise
    const r = (Math.random() * 16) | 0,
      // tslint:disable-next-line: no-bitwise
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function mergeObjectsWithOverwrite(obj1: any, obj2: any): any {
  if (typeof obj1 === typeof obj2) {
    Object.keys(obj2).map((key) => {
      if (typeof obj1[key] === 'object') {
        obj1[key] = mergeObjectsWithOverwrite(obj1[key], obj2[key])
      } else {
        obj1[key] = obj2[key]
      }
    })
    return obj1
  } else {
    error('Objects must be of the same type')
  }
}

export function log(
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal',
  message: string,
): void {
  const toWrite = `[${level.toUpperCase()}] : ${new Date().toLocaleString()} : ${message} \n`
  appendFileSync('logs/all.log', toWrite)
  appendFileSync(`logs/${level}.log`, toWrite)
}

export function calculateUptime(timeStarted: number): string {
  let uptime: number = Date.now() - timeStarted
  const days = Math.floor(uptime / 86400000)
  uptime = uptime - days * 86400000
  const hours = Math.floor(uptime / 3600000)
  uptime = uptime - hours * 3600000
  const minutes = Math.floor(uptime / 60000)
  uptime = uptime - minutes * 60000
  const seconds = Math.floor(uptime / 1000)
  uptime = uptime - seconds * 1000
  const milliseconds = uptime
  return `${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds, ${milliseconds} Milliseconds`
}

export function dateTryParse(
  value: string,
): { parsed: boolean; value?: number } {
  try {
    const date = Date.parse(value)
    return { parsed: true, value: date }
  } catch (e) {
    log('warn', e.message)
    return { parsed: false }
  }
}

export function validateDataWithConfig(obj: any, config: IConfig) {
  let valid: boolean = true
  config.data.forEach((definition: IDataDefinition) => {
    const value = obj[definition.name]
    valid =
      valid ===
      (typeof value === definition.type ||
        (definition.type === 'date' && dateTryParse(value).parsed) ||
        (definition.type === 'array' && Array.isArray(value)))
  })
  return valid
}

export function encryptBaseOnConfig(
  obj: any,
  config: IConfig,
): { data: any; config: IConfig } {

  console.log(obj)

  config.data.forEach((definition: IDataDefinition) => {
    if (definition.encryption === 'symmetric') {
      obj[definition.name] = AES.encrypt(definition.type === 'object' || definition.type === 'array' ? JSON.stringify(obj[definition.name]) : obj[definition.name])
    } else if (definition.encryption === 'asymmetric') {
      obj[definition.name] = SHA2.hashWithHmac(obj)
    }
  })

  return { data: obj, config }
}

export function decryptBasedOnConfig(obj: any, config: IConfig): { data: any } {

  config.data.forEach((definition: IDataDefinition) => {
    if (definition.encryption === 'symmetric') {
      obj[definition.name] = JSON.parse(AES.decrypt(obj[definition.name].value, obj[definition.name].password, obj[definition.name].salt, obj[definition.name].iv))
    }
  })
  return { data: obj }
}
