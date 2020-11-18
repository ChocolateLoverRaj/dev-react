import Addon from './addon'
import { SinonSpy } from 'sinon'

export declare function _reset(): void

declare class TextAddon extends Addon {
  constructor(text: string)

  text: string
  getText: SinonSpy<Array<unknown>, string>
}

export default TextAddon
