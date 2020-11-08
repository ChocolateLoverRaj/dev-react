// Manage Dirs
import GroupTask from './tasks/group-task.js'

class Dirs extends Map {
  constructor () {
    super()
    this.task = new GroupTask()
  }
  set (name, dir) {
    this.task.tasks.add(dir.task)
    this.task.update()
    return super.set(name, dir)
  }
  delete (name) {
    const dir = super.get(name)
    dir.destroy().then(() => {
      this.task.tasks.delete(dir.task)
      this.task.update()
    })
    return super.delete(name)
  }
}

export default Dirs