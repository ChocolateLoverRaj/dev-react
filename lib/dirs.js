// Manage Dirs
import GroupTask from './tasks/group-task.js'
import SortGroup from './tasks/sort-group.js'

class Dirs extends Map {
  constructor () {
    super()
    this.task = new SortGroup(new GroupTask())
  }
  set (name, dir) {
    this.task.group.tasks.add(dir.task)
    this.task.update()
    return super.set(name, dir)
  }
  delete (name) {
    const dir = super.get(name)
    dir.destroy().then(() => {
      this.task.group.tasks.delete(dir.task)
      this.task.update()
    })
    return super.delete(name)
  }
}

export default Dirs
