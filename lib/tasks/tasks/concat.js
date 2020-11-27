// Concatenate multiple tasks
import Task from './task.js'

class Concat extends Task {
  constructor (...tasks) {
    super()

    // Set the tasks for later use
    this.tasks = tasks

    // Forward all update events
    const update = () => {
      this.update()
    }
    tasks.forEach(task => {
      task.emitter.on('update', update)
    })
  }

  getLines () {
    // Concat all the lines
    // This won't work: [...lines], because it wouldn't concat, the array, it would create nested arrays
    return [].concat(...this.tasks.map(task => task.getLines()))
  }
}

export default Concat
