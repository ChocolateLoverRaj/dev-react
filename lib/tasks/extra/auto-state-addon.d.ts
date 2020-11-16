import Addon from '../addons/addon'
import StateAddon from './state-addon'

declare class AutoStateAddon<T1 extends Addon, T2 extends StateAddon<unknown>> extends Addon {
  constructor(headAddon: T1, ...addons: Array<T2>)

  headAddon: T1
  addons: Array<T2>
}

export default AutoStateAddon
