import Task from './task'

declare class SetTask<T extends Task> extends Task {
  constructor(...tasks: Array<T>)

  tasks: Set<T>
  updateHandler: () => void

  add(task: T): void
  delete(task: T): void
  [Symbol.iterator](): Iterator<T>
}

export default SetTask
