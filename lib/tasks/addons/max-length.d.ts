import Addon from './addon'

declare class MaxLengthAddon<T extends Addon> extends Addon {
  constructor(addon: T, maxLength: number)

  addon: T
  maxLength: number
}

export default MaxLengthAddon
