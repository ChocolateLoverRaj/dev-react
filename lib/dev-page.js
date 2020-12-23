import getPage from './get-page.js'
import {
  NameTask,
  CustomTask,
  TextAddon,
  ColorAddon
} from 'display-task'

const folderStructures = {
  normal: {
    pageDir (dir) {
      return dir
    }
  },
  github: {
    pageDir (dir) {
      return getPage(dir)
    }
  }
}

const devPage = (dirOutput, dir, options) => {
  const page = getPage(dir)
  const folderStructure = folderStructures[options.folderStructure]
  const pageDir = folderStructure.pageDir(dir)
  if (options.watch) {
    return {
      task: new NameTask(page, new CustomTask(new ColorAddon(new TextAddon(`\uD83D\uDCC1 ${page}`), 'blue')))
    }
  } else {

  }
}

export default devPage
