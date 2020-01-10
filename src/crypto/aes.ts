import * as crypto from 'crypto'
export class AES {

    public static encrypt(data: string): { data: string, password: string, salt: string, iv: string } {
        if (typeof data === 'undefined') {
            throw new Error('data is undefined')
        }
        const password = crypto.randomBytes(Math.round((Math.random() * 16) + 16)).toString('hex')
        const algorithm = 'aes-256-cbc'

        const salt = crypto.randomBytes(16).toString('hex')
        const key = crypto.scryptSync(password, salt, 32)

        const iv = crypto.randomBytes(16)

        const cipher = crypto.createCipheriv(algorithm, key, iv)

        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex')
        encrypted += cipher.final('hex')
        return {
            data: encrypted,
            password,
            salt,
            iv: iv.toString('hex'),
        }
    }

    public static decrypt(data: string, password: string, salt: string, iv: string): string {
        if (typeof data === 'undefined') {
            throw new Error('data is undefined')
        }
        const algorithm = 'aes-256-cbc'
        const key = crypto.scryptSync(password, salt, 32)

        const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'))

        // Encrypted using same algorithm, key and iv.
        let decrypted = decipher.update(data, 'hex', 'utf8')
        decrypted += decipher.final('utf8')
        return decrypted
    }
}
