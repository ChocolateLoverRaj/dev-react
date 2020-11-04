import { dirname } from 'dirname-filename-esm'
import DevReact from '@programmerraj/dev-react'

import { join } from 'path'

const __dirname = dirname(import.meta)

// TODO: make sure the inputDir is a dir and not a normal file
const pagesPath = join(__dirname, './pages/')

const devReact = new DevReact(pagesPath)

devReact.start()
  .then(() => {
    console.log('started')
  })
  .catch(e => {
    console.log('Error', e)
  })
