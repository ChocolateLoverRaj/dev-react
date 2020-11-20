import { SinonSpy } from 'sinon'
import EventEmitter from '../../__mocks__/eventemitter3.js'

declare function getFakeAddon(text: string): {
  text: SinonSpy<[], string>
  emitter: EventEmitter
}

export default getFakeAddon
