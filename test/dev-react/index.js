import { dirname } from 'dirname-filename-esm'
import devReact from '@programmerraj/dev-react'

import { join } from 'path'

const __dirname = dirname(import.meta)

const pagesPath = join(__dirname, './pages/')
const devPath = join(__dirname, './dev/')

const watch = false

const dev = devReact({
  inputDir: pagesPath,
  outputDir: devPath,
  watch: watch,
  folderStructure: 'github'
})

if (watch) {
  setTimeout(() => {
    dev.stop()
  }, 60000)
}
