// Set up the outputDir
import GroupTask from './tasks/group-task.js'
import CustomTask from './tasks/custom-task.js'
import EndAddon from './tasks/end-addon.js'
import NameAddon from './tasks/name-addon.js'
import ColorTask from './tasks/color-task.js'

class OutputDir {
  constructor (path) {
    this.path = path
    this.task = new ColorTask(new GroupTask())
  }

  empty () {
    const mainTask = new CustomTask(
      new EndAddon('\uD83D\uDCC1'),
      new NameAddon('Setup output dir', 3)
    )
    this.task.task.tasks.add(mainTask)
    const readTask = new ColorTask(new CustomTask(
      new EndAddon('\uD83D\uDCC1'),
      new NameAddon('Read Dir', 3)
    ))
    this.task.task.tasks.add(readTask)
    this.task.update()
  }
}

export default OutputDir
