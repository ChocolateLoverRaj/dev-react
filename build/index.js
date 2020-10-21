// Build necessary things
import { dirname } from 'dirname-filename-esm'
import { rollup } from 'rollup'
import { join } from 'path'

const __dirname = dirname(import.meta)

console.log(join(__dirname, '../_cjs', '__mocks__/fs.js'))
const build = files => Promise.all(files.map(async file => await (await rollup({
  input: join(__dirname, '../', file),
  external: ['stream', 'eventemitter3']
})).write({
  file: join(__dirname, '../_cjs', file),
  format: 'cjs',
  exports: 'named'
})))

console.log('Building...')
console.time('build')
build([
  '__mocks__/fs.js',
  '__mocks__/fs-promises.js'
])
  .then(() => {
    console.timeEnd('build')
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  })