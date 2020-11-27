import Addon from './addon'

declare class SetAddon<T extends Addon> extends Addon {
  constructor(...addons: Array<T>)

  addons: Set<T>

  add(addon: T): void
}

export default SetAddon
