import BaseTask from './base-task'
import Display from '../display'

declare class DisplayTask {
  constructor(task: BaseTask)

  task: BaseTask
  display: Display
  updateHandler: () => void

  close(): Promise<void>
}

export default DisplayTask
