import Addon from './addon'
import { SinonSpy } from 'sinon'

export declare function _reset(): void
export declare const _func: SinonSpy

declare class ConcatAddon extends Addon {
  constructor(...addons: Array<unknown>)

  addons: Array<unknown>
  getText: SinonSpy<Array<unknown>, string>
}

export default ConcatAddon
