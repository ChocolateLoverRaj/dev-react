import chokidar from 'chokidar'

import { basename } from 'path'

const devReact = async (pagesPath) => {
  const addPage = page => {
    // TODO: do something
    console.log('add page', page)
  }

  const removePage = page => {
    // TODO: do something
    console.log('remove page', page)
  }

  console.log(pagesPath)
  chokidar.watch(pagesPath, { depth: 0 })
    .on('addDir', path => {
      if (path !== pagesPath) {
        addPage(basename(path))
      }
    })
    .on('unlinkDir', path => {
      removePage(basename(path))
    })
}

export default devReact
