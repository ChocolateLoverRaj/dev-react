type promiseFunc = () => Promise<unknown>

declare class Refresher {
  constructor()

  running: boolean
  next?: promiseFunc

  run(func: promiseFunc): void
  refresh(func: promiseFunc): void
}

export default Refresher
