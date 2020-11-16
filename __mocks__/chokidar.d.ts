import EventEmitter from 'eventemitter3'
import { SinonSpy } from 'sinon'

export declare class FSWatcher extends EventEmitter {
  close: SinonSpy<[], Promise<undefined>>
}

declare namespace chokidar {
  const watch: () => FSWatcher
}

export default chokidar
