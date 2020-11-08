import BaseTask from './base-task'
import Group from './group-task'

declare class SortGroup extends BaseTask {
  constructor(group: Group)

  group: Group
}

export default SortGroup
