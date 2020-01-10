export * from './config'

import { dateTryParse, isFloat, isInt } from '../utils'
import { AES, SHA2 } from '../crypto'

import { IConfig, IDataDefinition } from './config'

export function verifyConfig(config: IConfig): boolean {
    let valid = config.data !== undefined && config.appName !== undefined && config.id !== undefined
    if (!valid) {
        return false
    }
    for (const definition of config.data) {
        if (definition.type === 'number' && (definition.numberFormat === null || definition.numberFormat === undefined)) {
            valid = false
        } else if (definition.type === 'object' && (definition.objectDefinitions === null || definition.objectDefinitions === undefined)) {
            valid = false
        } else if (definition.type === 'date' && (definition.dateFormat === null || definition.dateFormat === undefined)) {
            valid = false
        } else {
            valid = true
        }
    }
    return valid
}


// tslint:disable:no-bitwise
export function validateDataWithConfig(data: any, config: IConfig): boolean {
    let valid: number = 1

    config.data.forEach((definition) => {
        if (definition.type === 'object') {
            valid &= validateDataWithDefinition(data[definition.name], definition.objectDefinitions)
        } else if (definition.type === 'number') {
            if (definition.numberFormat.type === 'integer' && isInt(data[definition.name])) {
                valid &= 1
            } else if (definition.numberFormat.type === 'decimal' && isFloat(data[definition.name])) {
                valid &= 1
            } else {
                valid &= 0
            }
        } else if (definition.type === 'array' && Array.isArray(data[definition.name])) {
            valid &= 1
        } else if (definition.type === 'date' && dateTryParse(data[definition.name])) {
            valid &= 1
        } else {
            valid &= String(definition.type) === typeof data[definition.name] ? 1 : 0
        }
    })


    return valid === 1

}

function validateDataWithDefinition(data: any, definitions: IDataDefinition[]): number {
    let valid: number = 1

    if (data === undefined) {
        return 0
    }

    definitions.forEach((definition) => {

        if (definition.type === 'object') {
            valid &= validateDataWithDefinition(data[definition.name], definition.objectDefinitions)
        } else if (definition.type === 'number') {
            if (definition.numberFormat.type === 'integer' && isInt(data[definition.name])) {
                valid &= 1
            } else if (definition.numberFormat.type === 'decimal' && isFloat(data[definition.name])) {
                valid &= 1
            } else {
                valid &= 0
            }
        } else if (definition.type === 'array' && Array.isArray(data[definition.name])) {
            valid &= 1
        } else if (definition.type === 'date' && dateTryParse(data[definition.name])) {
            valid &= 1
        } else {
            valid &= String(definition.type) === typeof data[definition.name] ? 1 : 0
        }
    })
    return valid
}

// tslint: enable: no-bitwise
export function encryptBaseOnConfig(
    obj: any,
    config: IConfig,
): { data: any; config: IConfig } {

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
            obj[definition.name] = JSON.parse(AES.decrypt(obj[definition.name].data, obj[definition.name].password, obj[definition.name].salt, obj[definition.name].iv))
        } else if (definition.encryption === 'asymmetric') {
            obj[definition.name] = obj[definition.name].value
        }
    })
    return { data: obj }
}