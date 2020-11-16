import Task from './task'
import SetTask from './set'

declare class SortSetTask<T> extends Task {
  constructor(setTask: SetTask<T>, compareFn?: (a: T, b: T) => number)

  setTask: SetTask<T>
  compareFn?: (a: T, b: T) => number
}

export default SortSetTask
