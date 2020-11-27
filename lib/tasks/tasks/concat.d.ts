import Task from './task'

declare class ConcatTask<T extends Task> extends Task {
  constructor(...tasks: Array<T>)

  tasks: Array<T>
}

export default ConcatTask
