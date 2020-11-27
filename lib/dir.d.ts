import OutputDir from './output-dir'
import CustomTask from './tasks/tasks/custom'
import ConcatTask from './tasks/tasks/concat'
import HideTask from './tasks/extra/hide-task'
import NameTask from './tasks/extra/name-task'
import ColorAddon from './tasks/addons/color'
import TextAddon from './tasks/addons/text'
import StateAddon from './tasks/extra/state-addon'
import { FSWatcher } from 'chokidar'

declare class Dir {
  constructor(outputDir: OutputDir, inputDir: string, name: string)

  outputDir: OutputDir
  name: string
  page: string
  createTask: HideTask<CustomTask<StateAddon<TextAddon>>>
  removeAddon: StateAddon<TextAddon>
  removeTask: HideTask<CustomTask<StateAddon<TextAddon>>>
  closeChokidarAddon: StateAddon<TextAddon>
  closeChokidarTask: HideTask<CustomTask<StateAddon<TextAddon>>>
  task: NameTask<string, ConcatTask<CustomTask<ColorAddon<TextAddon>> | HideTask<CustomTask<StateAddon<TextAddon>>>>>
  chokidar: FSWatcher

  destroy(): Promise<void>
}

export default Dir
