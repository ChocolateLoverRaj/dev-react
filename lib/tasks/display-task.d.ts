import Task from './tasks/task'
import Display from '../display'

declare class DisplayTask<T extends Task> {
  constructor(task: T)

  task: T
  display: Display
  updateHandler: () => void

  close(): Promise<void>
}

export default DisplayTask
