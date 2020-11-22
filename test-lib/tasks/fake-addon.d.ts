import { SinonSpy } from 'sinon'
import EventEmitter from 'eventemitter3'

declare function getFakeAddon(text: string): {
  text: SinonSpy<[], string>
  emitter: EventEmitter
}

export default getFakeAddon
