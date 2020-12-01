import Dir from './dir'
import {
  SetTask,
  SortSetTask,
  CustomTask,
  NameTask,
  ConcatTask,
  HideTask,
  ColorAddon,
  TextAddon,
  StateAddon
} from 'display-task'

declare class Dirs extends Map<string, Dir>{
  constructor()

  setTask: SetTask<NameTask<string, ConcatTask<CustomTask<ColorAddon<TextAddon>> | HideTask<CustomTask<StateAddon<TextAddon>>>>>>
  task: SortSetTask<NameTask<string, ConcatTask<CustomTask<ColorAddon<TextAddon>> | HideTask<CustomTask<StateAddon<TextAddon>>>>>>

  destroy(): Promise<void>
}

export default Dirs
