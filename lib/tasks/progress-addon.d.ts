import BaseAddon from './base-addon'
import Styles from './default-styles'

declare class ProgressAddon extends BaseAddon {
  progress: number
  styles: typeof Styles
}

export default ProgressAddon
