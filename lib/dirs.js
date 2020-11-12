// Manage Dirs
import SetTask from './tasks/tasks/set.js'
import SortSetTask from './tasks/tasks/sort-set.js'

class Dirs extends Map {
  constructor () {
    super()
    this.setTask = new SetTask()
    this.task = new SortSetTask(this.setTask, (a, b) => Buffer.from(a.name).readIntBE(a.name.length - 1, 1) - Buffer.from(b.name).readIntBE(b.name.length - 1, 1))
  }
  set (name, dir) {
    this.setTask.add(dir.task)
    this.setTask.update()
    return super.set(name, dir)
  }
  delete (name) {
    const dir = super.get(name)
    dir.destroy().then(() => {
      this.setTask.delete(dir.task)
      this.setTask.update()
    })
    return super.delete(name)
  }
  async destroy () {
    // Destroy all tasks
    await Promise.all([...this.values()].map(async dir => {
      await dir.destroy()
      this.setTask.delete(dir.task)
      this.setTask.update()
    }))
  }
}

export default Dirs
