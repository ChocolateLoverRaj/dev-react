// Like path.normalize, but removes trailing slashes and backslashes
import { normalize } from 'path'

const trailingSlashRegex = /[\\\/]$/

export default s => normalize(s).replace(trailingSlashRegex, '')
