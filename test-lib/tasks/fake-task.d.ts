import { SinonSpy } from 'sinon'
import EventEmitter from '../../__mocks__/eventemitter3.js'

declare function getFakeTask(lines: Array<string>): {
  getLines: SinonSpy<[], Array<string>>
  emitter: EventEmitter
}

export default getFakeTask
