import EventEmitter from 'eventemitter3'

declare class Addon {
  constructor()

  emitter: EventEmitter<{ update(): void }>

  update(): void
  getText(): string
}

export default Addon
