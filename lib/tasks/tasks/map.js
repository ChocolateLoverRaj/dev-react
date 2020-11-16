// Store a map of keys and values (the values are tasks)
import Task from './task.js'
import ConcatTask from './concat.js'

// Methods for manipulating tasks should follow the Map() prototype for consistency.
class MapTask extends Task {
  constructor () {
    super()

    // Create a map for the actual map
    this.map = new Map()

    // Update event handler
    this.updateHandler = this.update.bind(this)
  }
  getLines () {
    // Create a new ConcatTask from values
    return new ConcatTask(...this.map.values()).getLines()
  }
  set (key, task) {
    // Get the task, if it exists
    const oldTask = this.map.get(key)
    if (oldTask) {
      // Stop handling updates
      oldTask.emitter.off('update', this.updateHandler)
    }
    // Add the new task to the map and handle events
    this.map.set(key, task)
    task.emitter.on('update', this.updateHandler)
  }
  delete (key) {
    // If key exists, stop handling updates
    const task = this.map.get(key)
    if (task) {
      // Stop handling updates
      task.emitter.off('update', this.updateHandler)
      // Delete key
      this.map.delete(key)
    }
  }
}

export default MapTask
