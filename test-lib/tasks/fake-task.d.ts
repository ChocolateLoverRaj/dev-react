import { SinonSpy } from 'sinon'
import EventEmitter from 'eventemitter3'

declare function getFakeTask(lines: Array<string>): {
  getLines: SinonSpy<[], Array<string>>
  emitter: EventEmitter
}

export default getFakeTask
