import EventEmitter from 'eventemitter3'

declare class Task {
  constructor()

  emitter: EventEmitter<{ update(): void }>

  update(): void
  getLines(): Array<string>
}

export default Task
