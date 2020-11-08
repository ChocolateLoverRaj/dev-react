import BaseTask from './base-task'
import Styles from './default-styles'

declare class GroupTask extends BaseTask {
  constructor(...tasks: BaseTask)

  tasks: Set<BaseTask>
  styles: typeof Styles

  getLines(styles?: typeof Styles): Array<string>
}

export default GroupTask
