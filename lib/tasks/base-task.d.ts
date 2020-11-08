import EventEmitter from 'eventemitter3'

interface Events {
  update: () => {}
}

declare class BaseTask extends EventEmitter<Events>{
  update(): void
  getLines(): Array<string>
}

export default BaseTask
