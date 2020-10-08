import WrapperError from './error.js'

import { readdir } from 'fs/promises'

const devReact = async (pagesPath) => {
  let pages
  try {
    pages = await readdir(pagesPath)
  } catch (e) {
    throw new WrapperError('Error reading pages dir', e)
  }

  // TODO: do something with the pages
}

export default devReact
