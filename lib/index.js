import WrapperError from './error.js'
import normalize from './normalize.js'

import chokidar from 'chokidar'
import fse from 'fs-extra'
import babel from '@babel/core'

import { basename, dirname } from 'path'
import { readFile } from 'fs/promises'

const babelPresetReact = (async () => {
  const preset = (await import('@babel/preset-react')).default.default
  return babel.createConfigItem(preset)
})()

const babelCustomPreset = (async () => {
  const preset = (await import('./plugin.js')).default(new Map()
    .set('react', '/scripts/react.js')
  )
  return babel.createConfigItem(preset)
})()

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
    console.log(pages)
  }

  const createBrowserJs = (page, code) => {
    pages.get(page).browserJsPromise = (async () => {
      const res = await babel.transformAsync(code, {
        presets: [await babelPresetReact],
        plugins: [await babelCustomPreset]
      })
      console.log(res)
    })().catch(e => {
      console.warn('Error transforming app.js', e)
    })
  }

  const addAppJs = path => {
    const page = basename(dirname(path))
    pages.get(page).appJsPromise = (async () => {
      const code = await readFile(path)
      createBrowserJs(page, code)
    })().catch(e => {
      console.warn('Error transforming app.js', e)
    })
  }

  const watcher = chokidar.watch(pagesPath, { depth: 1 })
    .on('addDir', path => {
      path = normalize(path)
      if (path !== pagesPath) {
        if (dirname(path) === pagesPath) {
          addPage(basename(path))
        }
      }
    })
    .on('unlinkDir', path => {
      removePage(basename(path))
    })
    .on('add', path => {
      path = normalize(path)
      if (dirname(dirname(path)) && basename(path) === 'app.js') {
        addAppJs(path)
      }
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
