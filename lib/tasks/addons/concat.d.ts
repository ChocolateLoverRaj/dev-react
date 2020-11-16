import Addon from './addon'

declare class ConcatAddon<T extends Addon> extends Addon {
  constructor(...addons: Array<T>)

  addons: Array<T>
}

export default ConcatAddon
