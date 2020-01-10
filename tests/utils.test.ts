import * as utils from '../src/utils'

describe('Utils test suites', () => {

    it('Should return a GUID in the appropriate format', () => {
        const guid = utils.guid()
        expect(guid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    })

    describe('DateTime Parse Tests', () => {
        it('Should return true and a value if it parsed correctly', () => {
            const result = utils.dateTryParse('10/10/2014')
            expect(result.parsed).toBe(true)
        })

        it('Should return false if it did not parse correctly', () => {
            const result = utils.dateTryParse('abcdefg')
            expect(result.parsed).toBe(false)
        })
    })

    describe('Object merging tests tests', () => {
        it('Should merge the two objects\' properties overwriting duplicates when provieded with valid objects', () => {
            const source = { a: 1, b: 2 }
            const addition = { b: 3, c: 4 }
            const result = utils.mergeObjectsWithOverwrite(source, addition)
            expect(result).toStrictEqual({ a: 1, b: 3, c: 4 })
        })

        it('Should merge object recursively', () => {
            const source = { a: 1, b: { subA: 2 } }
            const addition = { c: { subA: 3 }, b: { subA: 1 } }
            const result = utils.mergeObjectsWithOverwrite(source, addition)
            expect(result).toStrictEqual({ a: 1, b: { subA: 1 }, c: { subA: 3 } })
        })

        it('Should throw an error if either source or addition are undefined', () => {
            try {
                utils.mergeObjectsWithOverwrite(undefined, { a: 1 })
            } catch (err) {
                expect(err.message).toBe('source must not be undefined')
            }

            try {
                utils.mergeObjectsWithOverwrite({ a: 1 }, undefined)
            } catch (err) {
                expect(err.message).toBe('addition must not be undefined')
            }
        })
    })

    describe('Calculate uptime tests', () => {
        it('Should return a valid time listing when provieded with valid data', () => {
            const uptime = utils.calculateUptime(100)
            expect(uptime).toBeDefined()
            expect(typeof uptime).toBe('string')
        })

        it('Should throw a \'timeStarted must not be greater than the current time\' error when provided with a time after the current one', () => {
            try {
                utils.calculateUptime(Date.now() + 10000)
            } catch (err) {
                expect(err.message).toBe('timeStarted must not be greater than the current time')
            }
        })
    })

    describe('Sleep test', () => {
        it('Should sleep for a set amount of milliseconds', async () => {
            const start = Date.now()
            await utils.sleep(100)
            const end = Date.now()
            expect(end - start).toBeGreaterThanOrEqual(99)
        })
    })
})