import BaseTask from './base-task.js'

class ColorTask extends BaseTask {
  constructor (task) {
    super()
    this.task = task
    this.state = ColorTask.DOING
  }
  getLines (styles) {
    let color
    switch (this.state) {
      case ColorTask.DOING:
        color = 'yellow'
        break
      case ColorTask.DONE:
        color = 'green'
        break
      default:
        color = 'red'
    }
    return this.task.getLines({ ...styles, color })
  }
}

ColorTask.DOING = Symbol()
ColorTask.DONE = Symbol()
ColorTask.FAILED = Symbol()

export default ColorTask
