import Logger from '../src/logging'

describe('Logger tests', () => {

    Logger.path = './logs/test'

    it('Should write to the debug and all files when debug is called', () => {
        Logger.debug('Debug test')
        const debugText = Logger.read('debug')
        expect(debugText).toContain('Debug test')

        const allText = Logger.read('all')
        expect(allText).toContain('Debug test')
    })

    it('Should write to the Info and all files when Info is called', () => {
        Logger.info('Info test')
        const infoText = Logger.read('info')
        expect(infoText).toContain('Info test')

        const allText = Logger.read('all')
        expect(allText).toContain('Info test')
    })

    it('Should write to the warn and all files when warn is called', () => {
        Logger.warn('Warn test')
        const warnText = Logger.read('warn')
        expect(warnText).toContain('Warn test')

        const allText = Logger.read('all')
        expect(allText).toContain('Warn test')
    })

    it('Should write to the error and all files when error is called', () => {
        Logger.error('Error test')
        const errorText = Logger.read('error')
        expect(errorText).toContain('Error test')

        const allText = Logger.read('all')
        expect(allText).toContain('Error test')
    })

    it('Should write to the fatal and all files when fatal is called', () => {
        Logger.fatal('Fatal test')
        const fatalText = Logger.read('fatal')
        expect(fatalText).toContain('Fatal test')

        const allText = Logger.read('all')
        expect(allText).toContain('Fatal test')
    })

    it('Should return false if fileExists cannot find the file', () => {
        const found = Logger.fileExists('null')
        expect(found).toBe(false)
    })
})