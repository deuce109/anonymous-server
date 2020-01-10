import { AES, SHA2 } from '../src/crypto'

describe('Crypto test suite', () => {
    describe('SHA 2 Test Suite', () => {
        let key: string
        let hash: string
        it('Should generate a SHA-2 hash and key when the hashWithHmac function is called', () => {
            const cryptoValues = SHA2.hashWithHmac('password')
            key = cryptoValues.key
            hash = cryptoValues.value
            expect(cryptoValues.key.length).toBeGreaterThanOrEqual(32)
            expect(cryptoValues.value.length).toBe(128)
        })

        it('Should throw a "data is undefined" error when the hashWithHmac function is called with undefined data', () => {

            try {
                SHA2.hashWithHmac(undefined)
            } catch (e) {
                expect(e.message).toBe('data is undefined')
            }
        })

        it('Should verfiy the hash when the verify function is called with the correct data, hash and key', () => {
            const verified = SHA2.verify('password', key, hash)
            expect(verified).toBe(true)
        })

        it('Should not verify the hash when the verify function is called with the inccorect data, hash or key', () => {
            const wrongHash = SHA2.verify('password', key, 'password')
            expect(wrongHash).toBe(false)

            const newKey = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, , 10, 11, 12, 13, 14, 15, 16]).toString('hex')
            const wrongKey = SHA2.verify('password', newKey, 'password')
            expect(wrongKey).toBe(false)

            const wrongData = SHA2.verify('password1', key, hash)
            expect(wrongData).toBe(false)
        })

        it('Should throw a "data is undefined" error when the verifiy function is called with undefined data', () => {

            try {
                SHA2.verify(undefined, key, hash)
            } catch (e) {
                expect(e.message).toBe('data is undefined')
            }
        })
    })

    describe('AES Encryption test suite', () => {
        let encryptionValues
        it('Should encrypt the given data when the encrypt function is called with valid data', () => {
            encryptionValues = AES.encrypt('password')
            expect(encryptionValues).not.toBe(undefined)
            expect(encryptionValues.iv.length).toBe(32)
            expect(encryptionValues.salt.length).toBe(32)
        })

        it('Should throw a "data is undefined" error when the encrypt function is called with undefined data', () => {
            try {
                AES.encrypt(undefined)
            } catch (e) {
                expect(e.message).toBe('data is undefined')
            }
        })

        it('Should decrypt the data when provieded with the correct encrypted data, password, salt, and iv', () => {
            const { data, password, salt, iv } = encryptionValues
            const decryptedValue = AES.decrypt(data, password, salt, iv)
            expect(JSON.parse(decryptedValue)).toBe('password')
        })

        it('Should throw a "data is undefined" error when the encrypt function is called with undefined data', () => {
            const { password, salt, iv } = encryptionValues
            try {
                AES.decrypt(undefined, password, salt, iv)
            } catch (e) {
                expect(e.message).toBe('data is undefined')
            }
        })

        it('Should throw an error when the encrypt function is called with the incorrect data, password, salt, or iv', () => {
            const { data, password, salt, iv } = encryptionValues
            try {
                AES.decrypt('test', password, salt, iv)
            } catch (e) {
                expect(e).not.toBe(undefined)
            }

            try {
                AES.decrypt(data, 'test', salt, iv)
            } catch (e) {
                expect(e).not.toBe(undefined)
            }

            try {
                const testIv = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]).toString('hex')
                AES.decrypt(data, password, salt, testIv)
            } catch (e) {
                expect(e).not.toBe(undefined)
            }

            try {
                const testSalt = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]).toString('hex')
                AES.decrypt(data, password, testSalt, iv)
            } catch (e) {
                expect(e).not.toBe(undefined)
            }
        })
    })
})