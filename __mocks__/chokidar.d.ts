import EventEmitter from 'eventemitter3'
import { SinonSpy } from 'sinon'

export declare function _reset(): void

export declare class FSWatcher extends EventEmitter {
  close: SinonSpy<Array<unknown>, Promise<undefined>>
}

declare namespace chokidar {
  const watch: SinonSpy<Array<unknown>, FSWatcher>
}

export default chokidar
