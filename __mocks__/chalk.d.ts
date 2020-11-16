import { SinonSpy } from 'sinon'

export function _reset(): void

declare namespace chalk {
  declare const keyword: SinonSpy<Array<unknown>, SinonSpy<Array<unknown>, ''>>
}

export default chalk
