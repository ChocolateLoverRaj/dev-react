// Manage a dir
import ConcatTask from './tasks/tasks/concat.js'
import CustomTask from './tasks/tasks/custom.js'
import NameTask from './tasks/extensions/name-task.js'
import TextAddon from './tasks/addons/text.js'
import ColorAddon from './tasks/addons/color.js'
import getPage from './get-page.js'
import chokidar from 'chokidar'
import { join } from 'path'
import { mkdir } from 'fs/promises'

class Dir {
  constructor (outputDir, inputDir, name) {
    this.name = name
    this.page = getPage(name)
    const customTask = new CustomTask(new ColorAddon(new TextAddon(`\uD83D\uDCC1 ${this.page}`), 'blue'))
    this.task = new NameTask(this.page, new ConcatTask(customTask))
    this.create = mkdir(join(outputDir.path, name))

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