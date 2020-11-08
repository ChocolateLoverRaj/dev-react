import BaseAddon from './base-addon'
import Styles from './default-styles'

type side = 'left' | 'right'

declare class EndAddon extends BaseAddon {
  constructor(text?: string, side?: side)

  text: string
  side: side
  styles: typeof Styles
}

export default EndAddon
