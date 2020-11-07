import BaseTask from './base-task.js'
import defaultStyles from './default-styles.js'
import chalk from 'chalk'

class NameTask extends BaseTask {
  constructor (name) {
    super()
    this.styles = {}
    this.name = name
  }
  getLines (styles = {}) {
    styles = {
      ...defaultStyles,
      ...styles,
      ...this.styles
    }
    return [chalk.keyword(styles.color).bgKeyword(styles.bgColor)(this.name)]
  }
}

export default NameTask
