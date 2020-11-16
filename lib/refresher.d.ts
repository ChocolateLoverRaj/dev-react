import EventEmitter from 'eventemitter3'

type promiseFunc = () => Promise<unknown>

declare class Refresher {
  constructor()

  emitter: EventEmitter<{ done: () => {} }>
  running: boolean
  next?: promiseFunc

  run(func: promiseFunc): void
  refresh(func: promiseFunc): Promise<void>
}

export default Refresher
