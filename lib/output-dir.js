// Set up the outputDir
import ConcatTask from './tasks/tasks/concat.js'

class OutputDir {
  constructor (path) {
    this.path = path
    this.task = new ConcatTask()
  }

  empty () {

  }
}

export default OutputDir
