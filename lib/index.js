import WrapperError from './error.js'

import chokidar from 'chokidar'
import fse from 'fs-extra'

import { basename } from 'path'

const devReact = async (pagesPath, outputDir) => {
  // TODO: make sure these paths are strings

  const emptyOutputDir = fse.emptyDir(outputDir)

  const addPage = page => {
    // TODO: do something
    console.log('add page', page)
  }

  const removePage = page => {
    // TODO: do something
    console.log('remove page', page)
  }

  const watcher = chokidar.watch(pagesPath, { depth: 0 })
    .on('addDir', path => {
      if (path !== pagesPath) {
        addPage(basename(path))
      }
    })
    .on('unlinkDir', path => {
      removePage(basename(path))
    })

  const stop = async () => {
    await watcher.close()
  }

  emptyOutputDir.catch(e => {
    stop()
    throw new WrapperError('Error emptying outputDir', e)
  })
}

export default devReact
