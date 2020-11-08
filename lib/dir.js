// Manage a dir
import GroupTask from './tasks/group-task.js'
import CustomTask from './tasks/custom-task.js'
import EndAddon from './tasks/end-addon.js'
import NameAddon from './tasks/name-addon.js'
import getPage from './get-page.js'
import chokidar from 'chokidar'
import { join } from 'path'

class Dir {
  constructor (inputDir, name) {
    this.name = name
    this.page = getPage(name)
    const iconAddon = new EndAddon('\uD83D\uDCC1')
    // TODO: sort
    const nameAddon = new NameAddon(this.page, 2)
    const customTask = new CustomTask(iconAddon, nameAddon)
    this.task = new GroupTask(customTask)
    this.task.styles.color = 'blue'
    this.task.update()

    this.chokidar = chokidar.watch(join(inputDir, name))
      .on('add', () => {
        // TODO: do something
      })
  }

  async destroy () {
    // TODO: show destruction as task
    await this.chokidar.close()
  }
}

export default Dir