// Manage a Set() of tasks. This is useful for adding and deleting tasks in a set of tasks.
// ./concat.js cannot be used because it is meant for a static list of tasks. 
// In ./concat.js, the individual tasks can change, but the list cannot
import Task from './task.js'
import ConcatTask from './concat.js'

// Methods for manipulating tasks should follow the Set() prototype for consistency.
class SetTask extends Task {
  constructor (...tasks) {
    super()

    // Set() of tasks
    this.tasks = new Set()

    // Add all the tasks
    tasks.forEach(task => {
      this.add(task)
    })
  }
  getLines () {
    // Create a ConcatTask from current tasks
    return new ConcatTask(...this.tasks).getLines()
  }
  add (task) {
    // Add the task to the Set() of tasks
    this.tasks.add(task)

    // Forward events for the task
    task.emitter.on('update', () => {
      this.update()
    })
  }
}

export default SetTask
