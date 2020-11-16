import Task from '../tasks/task'

declare class NameTask<T1, T2 extends Task> extends Task {
  constructor(name: T1, task: T2)

  name: T1
  task: T2
}

export default NameTask
