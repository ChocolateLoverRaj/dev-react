import WrapperError from './error.js'

import chokidar from 'chokidar'
import fse from 'fs-extra'

import { basename, dirname, normalize, } from 'path'

const devReact = async (pagesPath, outputDir) => {
  try {
    pagesPath = normalize(pagesPath)
  } catch (e) {
    throw new WrapperError('Error normalizing pagesPath', e)
  }
  try {
    outputDir = normalize(outputDir)
  } catch (e) {
    throw new WrapperError('Error normalizing outputDir', e)
  }

  const pages = new Map()

  const emptyOutputDir = fse.emptyDir(outputDir)

  const addPage = page => {
    pages.set(page, {})
    console.log(pages)
  }

  const removePage = page => {
    pages.delete(page)
  }

  const watcher = chokidar.watch(pagesPath, { depth: 1 })
    .on('addDir', path => {
      if (path !== pagesPath) {
        if (dirname(path) === pagesPath) {
          addPage(basename(path))
        }
        console.log(dirname(path), pagesPath)
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
