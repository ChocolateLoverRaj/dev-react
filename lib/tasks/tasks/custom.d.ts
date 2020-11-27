import Task from './task'
import Addon from '../addons/addon'

declare class CustomTask<T extends Addon> extends Task {
  constructor(addon: T)

  addon: T
}

export default CustomTask
