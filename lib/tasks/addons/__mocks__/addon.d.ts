import { SinonSpy } from 'sinon'
import EventEmitter from '../../../../__mocks__/eventemitter3'

export declare function _reset(): void

declare class Addon {
  constructor()

  emitter: EventEmitter
  update: SinonSpy<[], void>
  getText: SinonSpy<Array<unknown>, ''>
}

export default Addon
