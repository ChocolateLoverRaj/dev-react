// Keep track of tasks
import Display from './display.js'
import EventEmitter from 'eventemitter3'
import chalk from 'chalk'

class BaseTask extends EventEmitter {
  constructor () {
    super()
    this.state = {
      styles: {}
    }
  }

  getLines () {
    return []
  }

  setState (v) {
    this.state = v
    this.emit('update')
  }
}

class NameTask extends BaseTask {
  constructor (name) {
    super()
    this.state.styles = {
      ...this.state.styles,
      color: 'orange',
      backgroundColor: 'blue'
    }
    this.name = name
  }

  getLines () {
    return [chalk.keyword(this.state.styles.color).bgKeyword(this.state.styles.backgroundColor)(this.name)]
  }
}

const showTasks = tasks => {
  const display = new Display()
  const update = () => {
    display.update([].concat(...tasks.map(task => task.getLines())))
  }
  tasks.map(task => {
    task.on('update', update)
  })
  update()
}

const task1 = new NameTask('apple')
const task2 = new NameTask('pineapple')

showTasks([task1, task2])
