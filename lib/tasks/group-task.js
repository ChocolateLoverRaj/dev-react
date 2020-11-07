import BaseTask from './base-task.js'
import defaultStyles from './default-styles.js'

class GroupTask extends BaseTask {
  constructor (...tasks) {
    super()
    const update = () => {
      this.update()
    }
    tasks.forEach(task => {
      task.on('update', update)
    })
    this.tasks = new Set(tasks)
    this.styles = {}
  }
  getLines (styles = {}) {
    styles = {
      ...defaultStyles,
      ...styles,
      ...this.styles
    }
    return [].concat(...[...this.tasks].map(task => task.getLines(styles)))
  }
}

export default GroupTask
