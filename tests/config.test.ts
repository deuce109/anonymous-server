import { IConfig, encryptBasedOnConfig, decryptBasedOnConfig, validateDataWithConfig, verifyConfig } from '../src/config'
describe('Config object and related methods test suite', () => {

    const config: IConfig = {
        id: '1',
        appName: 'mock',
        data: [
            {
                name: 'id',
                type: 'string',
                encryption: 'none',
            },
            {
                name: 'encrypt',
                type: 'string',
                encryption: 'symmetric',
            },
            {
                name: 'hash',
                type: 'string',
                encryption: 'asymmetric',
            },
            {
                name: 'none',
                type: 'string',
                encryption: 'none',
            },
            { name: 'array', type: 'array', encryption: 'none' },
            { name: 'boolean', type: 'boolean', encryption: 'none' },
            {
                name: 'object', type: 'object', encryption: 'none', objectDefinitions: [
                    {
                        name: 'encrypt',
                        type: 'string',
                        encryption: 'symmetric',
                    },
                    {
                        name: 'hash',
                        type: 'string',
                        encryption: 'asymmetric',
                    },
                    {
                        name: 'none',
                        type: 'string',
                        encryption: 'none',
                    },
                    { name: 'array', type: 'array', encryption: 'none' },
                    { name: 'boolean', type: 'boolean', encryption: 'none' },
                    {
                        name: 'object', type: 'object', encryption: 'none', objectDefinitions: [],
                    },
                    { name: 'date', type: 'date', encryption: 'none', dateFormat: 'MM/DD/YYYY' },
                    { name: 'float', type: 'number', encryption: 'none', numberFormat: { type: 'decimal' } },
                    { name: 'int', type: 'number', encryption: 'none', numberFormat: { type: 'integer' } },
                ],
            },
            { name: 'date', type: 'date', encryption: 'none', dateFormat: 'MM/DD/YYYY' },
            { name: 'float', type: 'number', encryption: 'none', numberFormat: { type: 'decimal' } },
            { name: 'int', type: 'number', encryption: 'none', numberFormat: { type: 'integer' } },
        ],
    }

    const testObject = {
        id: '1',
        none: 'test',
        encrypt: 'test ',
        hash: 'test',
        array: [],
        boolean: true,
        object: {
            none: 'test',
            encrypt: 'test ',
            hash: 'test',
            array: [],
            boolean: true,
            object: { test: 'test' },
            date: 101010,
            float: 1.05,
            int: 105,
        },
        date: 101010,
        float: 1.05,
        int: 105,
    }

    describe('Config validation', () => {
        it('Should validate when given a correct conifg', () => {
            const valid = verifyConfig(config)
            expect(valid).toBe(true)
        })

        it('Should not validate when given an incorrect conifg', () => {
            const badConfig: IConfig = {
                appName: 'mock', id: '1', data: [
                    { name: 'int', type: 'number', encryption: 'none' },
                    { name: 'object', type: 'object', encryption: 'none' },
                    { name: 'date', type: 'date', encryption: 'none' },
                ],
            }
            const valid = verifyConfig(badConfig)
            expect(valid).toBe(false)
        })
    })

    describe('Data validation using config', () => {
        it('Should return true if the data matches the config', () => {
            const validData = validateDataWithConfig(testObject, config)
            expect(validData).toBe(true)
        })

        it('Should return false if the data does not match the config', () => {
            const badData = { test: 'test', object: { test: 1 } }
            const validData = validateDataWithConfig(badData, config)
            expect(validData).toBe(false)
        })
    })

    describe('Encryption based on config tests', () => {

        let encrypted

        it('Should return an encrypted value when the config says to', () => {
            encrypted = encryptBasedOnConfig(testObject, config)
            expect(encrypted.data.encrypt.value).not.toBe('test')
            expect(encrypted.data.encrypt.password.length).toBeGreaterThanOrEqual(16)
            expect(encrypted.data.encrypt.iv.length).toBe(32)
            expect(encrypted.data.encrypt.salt.length).toBe(32)

            expect(encrypted.data.hash.value).not.toBe('test')
            expect(encrypted.data.hash.value.length).toBe(128)
            expect(encrypted.data.hash.key.length).toBeGreaterThanOrEqual(16)

            expect(encrypted.data.none).toBe('test')

            expect(encrypted.data.id).toBe('1')
        })

        it('Should return the decrypted data or hash when the config says to', () => {
            const hash = encrypted.data.hash.value
            const decrypted = decryptBasedOnConfig(encrypted.data, config)
            expect(decrypted.data.encrypt.trim()).toBe('test')
            expect(decrypted.data.id).toBe('1')
            expect(decrypted.data.none).toBe('test')
            expect(decrypted.data.hash).toBe(hash)

        })
    })


})