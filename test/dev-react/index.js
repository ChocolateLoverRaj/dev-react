import { dirname } from 'dirname-filename-esm'
import DevReact from '@programmerraj/dev-react'

import { join } from 'path'

const __dirname = dirname(import.meta)

const pagesPath = join(__dirname, './pages/')

const devReact = new DevReact(pagesPath)

devReact.watch()
  .catch(e => {
    console.log('Error', e)
  })
