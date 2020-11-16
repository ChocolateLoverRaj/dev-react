import Dir from './dir'
import SetTask from './tasks/tasks/set'
import SortSetTask from './tasks/tasks/sort-set'
import CustomTask from './tasks/tasks/custom'
import NameTask from './tasks/extra/name-task'
import ConcatTask from './tasks/tasks/concat'
import HideTask from './tasks/extra/hide-task'
import ColorAddon from './tasks/addons/color'
import TextAddon from './tasks/addons/text'
import StateAddon from './tasks/extra/state-addon'

declare class Dirs extends Map<string, Dir>{
  constructor()

  setTask: SetTask<NameTask<string, ConcatTask<CustomTask<ColorAddon<TextAddon>> | HideTask<CustomTask<StateAddon<TextAddon>>>>>>
  task: SortSetTask<NameTask<string, ConcatTask<CustomTask<ColorAddon<TextAddon>> | HideTask<CustomTask<StateAddon<TextAddon>>>>>>

  destroy(): Promise<void>
}

export default Dirs
