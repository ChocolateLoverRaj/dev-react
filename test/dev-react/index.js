import { dirname } from 'dirname-filename-esm'
import devReact from '@programmerraj/dev-react'

import { join } from 'path'

const __dirname = dirname(import.meta)

const pagesPath = join(__dirname, './pages/')
const devPath = join(__dirname, './dev/')

const watch = true

const dev = devReact({
  inputDir: pagesPath,
  outputDir: devPath,
  watch: watch
})

if (watch) {
  setTimeout(() => {
    dev.stop()
  }, 5000)
}
