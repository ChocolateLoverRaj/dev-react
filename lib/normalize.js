// Like path.normalize, but removes trailing (slashes and backslashes)
// Also converts all backslashes to slashes
const backslashRegex = /\\/g
const multipleSlashRegex = /\/+/g
const dotSlashRegex = /\/\.\//g
const dotDotSlashRegex = /[^/]*\/\.{2}\//g
const trailingSlashRegex = /\/$/

export default p => p
  .replace(backslashRegex, '/')
  .replace(multipleSlashRegex, '/')
  .replace(dotSlashRegex, '/')
  .replace(dotDotSlashRegex, '')
  .replace(trailingSlashRegex, '')
