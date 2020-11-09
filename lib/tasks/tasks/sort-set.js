// Sorts the tasks of a SetTask
import Task from './task.js'
import ConcatTask from './concat.js'

class SortSetTask extends Task {
  constructor (setTask, compareFn) {
    super()

    // Set the setTask and compareFn for later
    this.setTask = setTask
    this.compareFn = compareFn

    // Forward update event of setTask
    setTask.emitter.on('update', () => {
      this.update()
    })
  }
  getLines () {
    // Sort the tasks in this.setTask
    // Then create a ConcatTask
    return new ConcatTask(...[...this.setTask].sort(this.compareFn)).getLines()
  }
}

export default SortSetTask
