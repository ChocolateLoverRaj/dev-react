// A task with a name
import Task from '../tasks/task.js'

class NameTask extends Task {
  constructor (name, task) {
    super()

    // Set the name and task
    this.name = name
    this.task = task

    task.emitter.on('update', () => {
      this.update()
    })
  }
  getLines () {
    // This doesn't change anything
    return this.task.getLines()
  }
}

export default NameTask
