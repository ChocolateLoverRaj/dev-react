import Dirs from './dirs'
import OutputDir from './output-dir'
import { FSWatcher } from 'chokidar'
import { Application } from 'express'
import {
  StateAddon,
  TextAddon,
  HideTask,
  CustomTask,
  MapTask,
  ConcatTask,
  SortSetTask,
  AutoStateAddon,
  NameTask,
  ColorAddon,
  DisplayTask
} from 'display-task'

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
