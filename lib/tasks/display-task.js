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

  async close () {
    this.task.off('update', this.updateHandler)
    process.stdout.off('resize', this.updateHandler)
    await this.display.close()
  }
}

export default DisplayTask
