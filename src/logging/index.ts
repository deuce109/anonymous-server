import * as fs from 'fs'

export default class Logger {

    public static path = './logs'

    public static debug(message: string): void {

        if (!this.fileExists(this.path)) {
            fs.mkdirSync(this.path)
        }
        const toWrite = `[DEBUG] : ${new Date().toLocaleString()} : ${message} \n`
        fs.appendFileSync(`${this.path}/all.log`, toWrite)
        fs.appendFileSync(`${this.path}/debug.log`, toWrite)
    }

    public static info(message: string): void {

        if (!this.fileExists(this.path)) {
            fs.mkdirSync(this.path)
        }
        const toWrite = `[INFO] : ${new Date().toLocaleString()} : ${message} \n`
        fs.appendFileSync(`${this.path}/all.log`, toWrite)
        fs.appendFileSync(`${this.path}/info.log`, toWrite)
    }

    public static warn(message: string): void {

        if (!this.fileExists(this.path)) {
            fs.mkdirSync(this.path)
        }
        const toWrite = `[WARN] : ${new Date().toLocaleString()} : ${message} \n`
        fs.appendFileSync(`${this.path}/all.log`, toWrite)
        fs.appendFileSync(`${this.path}/warn.log`, toWrite)
    }

    public static error(message: string): void {

        if (!this.fileExists(this.path)) {
            fs.mkdirSync(this.path)
        }
        const toWrite = `[ERROR] : ${new Date().toLocaleString()} : ${message} \n`
        fs.appendFileSync(`${this.path}/all.log`, toWrite)
        fs.appendFileSync(`${this.path}/error.log`, toWrite)
    }

    public static fatal(
        message: string): void {
        if (!this.fileExists(this.path)) {
            fs.mkdirSync(this.path)
        }
        const toWrite = `[FATAL] : ${new Date().toLocaleString()} : ${message} \n`
        fs.appendFileSync(`${this.path}/all.log`, toWrite)
        fs.appendFileSync(`${this.path}/fatal.log`, toWrite)
    }

    public static fileExists(path?: string): boolean {
        let stat = null
        try {
            stat = fs.statSync(path || this.path)
        } catch (err) {
            stat = null
        }
        return stat !== null
    }

    public static read(file: string = 'all'): string {
        return fs.readFileSync(`${this.path}/${file}.log`).toString()
    }
}