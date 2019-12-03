import * as crypto from 'crypto'
export class AES {

    public static encrypt(data: string): { value: string, password: string,  salt: string, iv: string} {
        const password = crypto.randomBytes(Math.round((Math.random() * 16) + 16)).toString('hex')
        const algorithm = 'aes-256-cbc'
        // Use the async `crypto.scrypt()` instead.
        const salt = crypto.randomBytes(16).toString('hex')
        const key = crypto.scryptSync(password, salt, 32)
        // Use `crypto.randomBytes` to generate a random iv instead of the static iv
        // shown here.
        const iv = crypto.randomBytes(16) // Initialization vector.

        const cipher = crypto.createCipheriv(algorithm, key, iv)

        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex')
        encrypted += cipher.final('hex')
        return {
            value: encrypted,
            password,
            salt,
            iv: iv.toString('hex'),
        }
    }

    public static decrypt(data: string, password: string, salt: string, iv: string): string {

        const algorithm = 'aes-256-cbc'
        const key = crypto.scryptSync(password, salt, 32)

        const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'))

// Encrypted using same algorithm, key and iv.
        const encrypted = data
        let decrypted = decipher.update(encrypted, 'hex', 'utf8')
        decrypted += decipher.final('utf8')
        return decrypted
    }
}
