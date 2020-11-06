// Keep track of tasks
import Display from './display.js'
import EventEmitter from 'eventemitter3'

class Task extends EventEmitter {
  constructor () {
    super()
    this.state = false
  }
  getLines () {
    return [this.state ? 'finished' : 'not finished']
  }

  setState (v) {
    this.state = v
    this.emit('update')
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

const task1 = new Task()
const task2 = new Task()

showTasks([task1, task2])

// TODO: Clear extra characters at the end of line
task2.setState(true)
