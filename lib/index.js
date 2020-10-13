import WrapperError from './error.js'
import normalize from './normalize.js'
import dirDotDot from './dir.js'

import chokidar from 'chokidar'
import fse from 'fs-extra'
import babel from '@babel/core'
import createImportLister from 'babel-plugin-list-imports'

import { basename, dirname, join } from 'path'
import { readFile, writeFile } from 'fs/promises'

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

  const createPageOutputDir = async page => {
    const path = join(outputDir, page)
    await fse.emptyDir(path)
    return path
  }

  const addPage = page => {
    pages.set(page, {
      components: new Map(),
      outputDir: createPageOutputDir(page)
    })
  }

  const removePage = page => {
    pages.delete(page)
    console.log(pages)
  }

  const getComponentInfo = path => ({
    page: basename(dirDotDot(2, path)),
    filename: basename(path)
  })

  const transformComponent = async (page, filename, inputCode) => {
    const { code } = await babel.transformAsync(await inputCode, {
      presets: [await babelPresetReact],
      plugins: [await babelCustomPreset]
    })
    const outputDir = await pages.get(page).outputDir
    await writeFile(join(outputDir, filename), code)
  }

  const addComponent = path => {
    const { page, filename } = getComponentInfo(path)
    const code = readFile(path, 'utf-8')
    pages.get(page).components.set(filename, {
      js: transformComponent(page, filename, code)
        .catch(e => {
          console.warn(`Error transforming component: ${filename} in page ${page}`, e)
        })
        .then(() => {
          console.log(pages.get(page).components)
        })
    })
  }

  const removeComponent = path => {
    const { page, filename } = getComponentInfo(path)
    pages.get(page).components.delete(filename)
    console.log(pages)
  }

  const isComponent = path =>
    dirDotDot(3, path) === pagesPath &&
    basename(dirDotDot(1, path)) === 'components'

  const changeHandler = path => {
    path = normalize(path)
    if (isComponent(path)) {
      addComponent(path)
    }
  }

  const watcher = chokidar.watch(pagesPath, { depth: 2 })
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
    .on('add', changeHandler)
    .on('unlink', path => {
      path = normalize(path)
      if (isComponent(path)) {
        removeComponent(path)
      }
    })
    .on('change', changeHandler)

  const stop = async () => {
    await watcher.close()
  }

  emptyOutputDir.catch(e => {
    stop()
    throw new WrapperError('Error emptying outputDir', e)
  })
}

export default devReact
