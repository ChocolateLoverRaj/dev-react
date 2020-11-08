import BaseAddon from './base-addon'
import Styles from './default-styles'

declare class NameAddon extends BaseAddon {
  constructor(name?: string, margin?: number)

  name: string
  margin: number
  styles: typeof Styles
}

export default NameAddon
