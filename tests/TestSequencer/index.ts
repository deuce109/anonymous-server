import Sequencer from '@jest/test-sequencer'
import { Test } from 'jest-runner/build/types'

export default class CustomSequencer extends Sequencer {
    public sort(tests): Test[] {
        // Test structure information
        // https://github.com/facebook/jest/blob/6b8b1404a1d9254e7d5d90a8934087a9c9899dab/packages/jest-runner/src/types.ts#L17-L21
        let copyTests: Test[] = Array.from(tests)
        copyTests.copyWithin(0, tests.findIndex((t) => t.path.includes('logging')), 1)
        return copyTests
    }
}
