// Display a text addon
import Task from './task.js'

class CustomTask extends Task {
  constructor (addon) {
    super()
    this.addon = addon
    addon.emitter.on('update', () => {
      this.update()
    })
  }

  getLines () {
    return [this.addon.getText()]
  }
}

export default CustomTask
