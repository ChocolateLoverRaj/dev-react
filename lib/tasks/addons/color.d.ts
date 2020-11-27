import Addon from './addon'
import { ForegroundColor } from 'chalk'

declare class ColorAddon<T extends Addon> extends Addon {
  constructor(addon: T, color: typeof ForegroundColor)

  addon: T
  color: typeof ForegroundColor
}

export default ColorAddon
