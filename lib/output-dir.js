// Set up the outputDir
import ConcatTask from './tasks/tasks/concat.js'
import fsExtra from 'fs-extra'

class OutputDir {
  constructor (path) {
    this.path = path
    this.task = new ConcatTask()
    this.create = fsExtra.ensureDir(path)
  }

  empty () {

  }
}

export default OutputDir
