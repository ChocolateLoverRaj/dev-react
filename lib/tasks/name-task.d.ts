import BaseTask from './base-task'
import Styles from './default-styles'

declare class NameTask extends BaseTask {
  constructor(name: string, task: BaseTask)

  name: string
  task: BaseTask

  getLines(styles?: typeof Styles): Array<string>
}

export default NameTask
