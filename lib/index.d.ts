import Dirs from './dirs'
import StateAddon from './tasks/extra/state-addon'
import TextAddon from './tasks/addons/text'
import HideTask from './tasks/extra/hide-task'
import CustomTask from './tasks/tasks/custom'
import MapTask from './tasks/tasks/map'
import ConcatTask from './tasks/tasks/concat'
import SortSetTask from './tasks/tasks/sort-set'
import AutoStateAddon from './tasks/extra/auto-state-addon'
import NameTask from './tasks/extra/name-task'
import ColorAddon from './tasks/addons/color'
import DisplayTask from './tasks/display-task'
import OutputDir from './output-dir'
import { FSWatcher } from 'chokidar'
import { Application } from 'express'

declare class DevReact {
  constructor(options: { inputDir: string, outputDir: string })

  inputDir: string
  outputDir: string
  emptyDir: OutputDir
  dirs: Dirs
  closeChokidarAddon: StateAddon<TextAddon>
  closeChokidar: HideTask<CustomTask<StateAddon<TextAddon>>>
  warningsBadDir: MapTask<string, CustomTask<ColorAddon<TextAddon>>>
  warningsUnrecognized: MapTask<string, CustomTask<ColorAddon<TextAddon>>>
  task: ConcatTask<
    HideTask<ConcatTask<CustomTask<AutoStateAddon<TextAddon, StateAddon<TextAddon>> | StateAddon<TextAddon>>>> |
    SortSetTask<NameTask<string, ConcatTask<CustomTask<ColorAddon<TextAddon>> | HideTask<CustomTask<StateAddon<TextAddon>>>>>> |
    HideTask<CustomTask<StateAddon<TextAddon>>> |
    MapTask<string, CustomTask<ColorAddon<TextAddon>>>
  >
  server: Application
  displayTask?: DisplayTask<ConcatTask<
    HideTask<ConcatTask<CustomTask<AutoStateAddon<TextAddon, StateAddon<TextAddon>> | StateAddon<TextAddon>>>> |
    SortSetTask<NameTask<string, ConcatTask<CustomTask<ColorAddon<TextAddon>> | HideTask<CustomTask<StateAddon<TextAddon>>>>>> |
    HideTask<CustomTask<StateAddon<TextAddon>>> |
    MapTask<string, CustomTask<ColorAddon<TextAddon>>>
  >>
  chokidar?: FSWatcher

  start(): Promise<void>
  stop(): Promise<void>
}

export default DevReact
