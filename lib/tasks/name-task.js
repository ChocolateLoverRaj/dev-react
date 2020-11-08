import BaseTask from './base-task.js'

class NameTask extends BaseTask {
  constructor (name, task) {
    super()
    this.name = name
    this.task = task
  }
  getLines (styles) {
    return this.task.getLines(styles)
  }
}

export default NameTask
