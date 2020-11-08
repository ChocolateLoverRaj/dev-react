import Display from '../display.js'

class DisplayTask {
  constructor (task) {
    this.task = task
    this.display = new Display()
    this.updateHandler = () => {
      this.display.update(task.getLines())
    }
    task.on('update', this.updateHandler)
    process.stdout.on('resize', this.updateHandler)
    this.updateHandler()
  }

  close () {
    // TODO Display.prototype.close method
    this.task.off('update', this.updateHandler)
    process.stdout.off('resize', this.updateHandler)
  }
}

export default DisplayTask
