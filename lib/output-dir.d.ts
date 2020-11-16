import ConcatTask from './tasks/tasks/concat'
import CustomTask from './tasks/tasks/custom'
import HideTask from './tasks/extra/hide-task'
import TextAddon from './tasks/addons/text'
import StateAddon from './tasks/extra/state-addon'
import AutoStateAddon from './tasks/extra/auto-state-addon'

declare class OutputDir {
  constructor(path: string)

  path: string
  readAddon: StateAddon<TextAddon>
  deleteAddon: StateAddon<TextAddon>
  task: HideTask<ConcatTask<CustomTask<AutoStateAddon<TextAddon, StateAddon<TextAddon>> | StateAddon<TextAddon>>>>
  ensureFiles: Set<string> | Map<string, Promise<void>>
  deleteFiles: Map<string, Promise<void>>
  read?: Promise<void>
  deletePromise?: Promise<void>

  empty(): void
  createDir(name: string): Promise<void>
  removeDir(name: string): Promise<void>
  destroy(): Promise<void>
}

export default OutputDir
