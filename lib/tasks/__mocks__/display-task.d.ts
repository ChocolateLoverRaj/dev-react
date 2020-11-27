import { SinonSpy } from 'sinon'

export function _reset(): void

declare class DisplayTask {
  constructorArgs: Array<unknown>
  close: SinonSpy<Array<unknown>, Promise<void>>
}

export default DisplayTask
