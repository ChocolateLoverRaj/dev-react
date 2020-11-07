import BaseTask from './base-task.js'
import defaultStyles from './default-styles.js'

class GroupTask extends BaseTask {
  constructor (...tasks) {
    super()
    this.tasks = tasks;
    this.styles = {}
  }
  getLines (styles = {}) {
    styles = {
      ...defaultStyles,
      ...styles,
      ...this.styles
    }
    return [].concat(...this.tasks.map(task => task.getLines(styles)))
  }
}

export default GroupTask
