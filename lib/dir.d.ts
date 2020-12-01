import OutputDir from './output-dir'
import {
  ConcatTask,
  CustomTask,
  HideTask,
  NameTask,
  TextAddon,
  ColorAddon,
  StateAddon,
} from 'display-task'
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
