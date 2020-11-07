// A list of warnings
import GroupTask from './tasks/group-task.js'

class WarningsList extends Map {
  constructor () {
    super()
    this.task = new GroupTask()
    this.task.styles.color = 'yellow'
  }
  set (name, task) {
    this.task.tasks.add(task)
    this.task.update()
    return super.set(name, task)
  }
  delete (name) {
    this.task.tasks.delete(super.get(name))
    this.task.update()
    return super.delete(name)
  }
  clear () {
    this.task.tasks.clear()
    this.task.update()
    return super.clear()
  }
}

export default WarningsList
