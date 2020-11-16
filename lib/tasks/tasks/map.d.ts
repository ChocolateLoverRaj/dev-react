import Task from './task'

declare class MapTask<T1, T2 extends Task> extends Task {
  constructor()

  map: Map<T1, T2>
  updateHandler: () => void

  set(key: T1, task: T2): void
  delete(key: T1): void
}

export default MapTask
