import { dirname } from 'dirname-filename-esm'
import devReact from '@programmerraj/dev-react'

import { join } from 'path'

const __dirname = dirname(import.meta)

const pagesPath = join(__dirname, './pages/')

devReact(pagesPath)
