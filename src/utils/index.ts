import * as crypto from 'crypto'

export function sleep(ms): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function guid(): string {
  return ('' + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).toString().replace(/[018]/g, (c) =>
    (parseInt(c, 10) ^ crypto.randomBytes(1)[0] & 15 >> parseInt(c, 10) / 4).toString(16),
  )
}

export function isInt(value) {
  return Number(value) === value && value % 1 === 0
}

export function isFloat(value) {
  return Number(value) === value
}


export function mergeObjectsWithOverwrite(source: object, addition: object): object {

  if (typeof source === 'undefined') {
    throw new Error('source must not be undefined')
  }
  if (typeof addition === 'undefined') {
    throw new Error('addition must not be undefined')
  }

  Object.keys(addition).map((key) => {
    if (typeof source[key] === 'object') {
      source[key] = mergeObjectsWithOverwrite(source[key], addition[key])
    } else {
      source[key] = addition[key]
    }
  })
  return source

}


export function calculateUptime(timeStarted: number): string {
  let uptime: number = Date.now() - timeStarted
  if (uptime < 0) {
    throw new Error('timeStarted must not be greater than the current time')
  }
  const days = Math.floor(uptime / 86400000)
  uptime = uptime - days * 86400000
  const hours = Math.floor(uptime / 3600000)
  uptime = uptime - hours * 3600000
  const minutes = Math.floor(uptime / 60000)
  uptime = uptime - minutes * 60000
  const seconds = Math.floor(uptime / 1000)
  uptime = uptime - seconds * 1000
  const milliseconds = uptime
  return `${days}d, ${hours}h, ${minutes}m, ${seconds}s, ${milliseconds}ms`
}

export function dateTryParse(
  value: string,
): { parsed: boolean; value?: number } {
  const date = Date.parse(value)
  return !isNaN(date) ? { parsed: true, value: date } : { parsed: false }

}




