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

    // Set an update function for event handler
    this.updateHandler = this.update.bind(this)

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
    // Make sure it doesn't already exist
    if (this.tasks.has(task)) {
      return
    }

    // Add the task to the Set() of tasks
    this.tasks.add(task)

    // Forward events for the task
    task.emitter.on('update', this.updateHandler)
  }

  delete (task) {
    // If the task was deleted, remove the event listener
    if (this.tasks.delete(task)) {
      task.emitter.off('update', this.updateHandler)
    }
  }

  [Symbol.iterator] () {
    return this.tasks[Symbol.iterator]()
  }
}

export default SetTask
