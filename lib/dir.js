// Manage a dir
import ConcatTask from './tasks/tasks/concat.js'
import CustomTask from './tasks/tasks/custom.js'
import HideTask from './tasks/extra/hide-task.js'
import NameTask from './tasks/extra/name-task.js'
import TextAddon from './tasks/addons/text.js'
import ColorAddon from './tasks/addons/color.js'
import StateAddon from './tasks/extra/state-addon.js'
import getPage from './get-page.js'
import chokidar from 'chokidar'
import { join } from 'path'

class Dir {
  constructor (outputDir, inputDir, name) {
    this.outputDir = outputDir
    this.name = name
    this.page = getPage(name)
    const customTask = new CustomTask(new ColorAddon(new TextAddon(`\uD83D\uDCC1 ${this.page}`), 'blue'))
    const stateAddon = new StateAddon(new TextAddon('  Create dir'))
    this.createTask = new HideTask(new CustomTask(stateAddon))
    this.removeAddon = new StateAddon(new TextAddon('  Remove dir'))
    this.removeTask = new HideTask(new CustomTask(this.removeAddon))
    this.removeTask.hidden = true
    this.closeChokidarAddon = new StateAddon(new TextAddon('  Close chokidar'))
    this.closeChokidarTask = new HideTask(new CustomTask(this.closeChokidarAddon))
    this.closeChokidarTask.hidden = true
    this.task = new NameTask(this.page, new ConcatTask(
      customTask,
      this.createTask,
      this.removeTask,
      this.closeChokidarTask
    ))
    outputDir.createDir(name)
      .then(() => {
        stateAddon.state = 'complete'
      })
      .catch(() => {
        stateAddon.state = 'failed'
      })
      .then(() => {
        stateAddon.update()
      })

    this.chokidar = chokidar.watch(join(inputDir, name))
      .on('add', () => {
        // TODO: do something
      })
  }

  async destroy () {
    // Show / hide tasks
    this.createTask.hidden = true
    this.removeTask.hidden = false
    this.closeChokidarTask.hidden = false
    this.task.update()

    await Promise.all([
      this.outputDir.removeDir(this.name)
        .then(() => {
          this.removeAddon.state = 'complete'
        })
        .catch(() => {
          this.removeAddon.state = 'failed'
        })
        .then(() => {
          this.removeAddon.update()
        }),
      this.chokidar.close()
        .then(() => {
          this.closeChokidarAddon.state = 'complete'
        })
        .catch(() => {
          this.closeChokidarAddon.state = 'failed'
        })
        .then(() => {
          this.closeChokidarAddon.update()
        })
    ])
  }
}

export default Dir