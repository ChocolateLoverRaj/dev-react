// Manage Dirs
import { SetTask, SortSetTask } from 'display-task'

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
    await Promise.all([...this].map(async ([name, dir]) => {
      await dir.destroy()
      this.setTask.delete(dir.task)
      this.setTask.update()
      super.delete(name)
    }))
  }
}

export default Dirs
