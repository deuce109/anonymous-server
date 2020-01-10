import * as crypto from 'crypto'
export class SHA2 {

  public static hashWithHmac(data: string, key?: string): { value: string; key: string } {
    if (typeof data === 'undefined') {
      throw new Error('data is undefined')
    }
    key = key || crypto.randomBytes(Math.round(Math.random() * 16 + 16)).toString('hex')
    const hmac = crypto.createHmac('SHA512', key)

    hmac.update(JSON.stringify(data))
    const hash = hmac.digest('hex')
    return {
      value: hash,
      key,
    }
  }

  public static verify(data: any, key: string, expected: string): boolean {
    const current = this.hashWithHmac(data, key)
    return current.value === expected
  }
}
