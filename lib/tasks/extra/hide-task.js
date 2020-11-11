// Hide a task
import Task from '../tasks/task.js'

class HideTask extends Task {
  constructor (task) {
    super()

    this.task = task
    this.hidden = false
  }
  getLines () {
    // Return empty array if hidden
    return this.hidden
      ? []
      : this.task.getLines()
  }
}

export default HideTask
