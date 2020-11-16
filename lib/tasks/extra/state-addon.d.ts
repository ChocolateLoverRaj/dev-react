import Addon from '../addons/addon'

declare class StateAddon<T extends Addon> extends Addon {
  constructor(addon: T)

  state: 'in progress' | 'complete' | 'failed'
}

export default StateAddon
