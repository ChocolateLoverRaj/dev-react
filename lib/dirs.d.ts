import Dir from './dir'
import SortGroup from './tasks/sort-group'

declare class Dirs extends Map<string, Dir>{
  constructor()

  task: SortGroup
}

export default Dirs
