// Keep track of tasks
import Display from './display.js'
import EventEmitter from 'eventemitter3'
import chalk from 'chalk'

class BaseTask extends EventEmitter {
  constructor () {
    super()

  }
  getLines () {
    return []
  }
  update () {
    this.emit('update')
  }
}

class NameTask extends BaseTask {
  constructor (name) {
    super()
    this.styles = {
      color: 'red',
      bgColor: 'black'
    }
    this.name = name
  }
  getLines (styles = {}) {
    styles = {
      ...styles,
      ...this.styles
    }
    return [chalk.keyword(styles.color).bgKeyword(styles.bgColor)(this.name)]
  }
}

const displayTask = task => {
  const display = new Display()
  const update = () => {
    display.update(task.getLines())
  }
  task.on('update', update)
  update()
}

const task = new NameTask('apple')
displayTask(task)
task.styles.color = 'green'
task.update()
