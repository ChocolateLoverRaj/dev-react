import BaseTask from './base-task'
import BaseAddon from './base-addon'
import Styles from './default-styles'

declare class CustomTask extends BaseTask {
  constructor(...addons: BaseAddon)

  styles: typeof Styles
  addons: Array<BaseAddon>

  getLines(styles?: typeof Styles): Array<string>
}

export default CustomTask
