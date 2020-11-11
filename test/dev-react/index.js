import { dirname } from 'dirname-filename-esm'
import DevReact from '@programmerraj/dev-react'

import { join } from 'path'

const __dirname = dirname(import.meta)

const pagesPath = join(__dirname, './pages/')
const devPath = join(__dirname, './dev/')

const devReact = new DevReact({
  inputDir: pagesPath,
  outputDir: devPath
})

setTimeout(() => {
  devReact.unwatch()
}, 3000)

devReact.watch()
