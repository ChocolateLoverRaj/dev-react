// Build necessary things
import transformImports from '../lib/babel-plugin-transform-import-paths/index.js'
import babel from '@babel/core'
import { dirname as getDirname } from 'dirname-filename-esm'
import transformModules from '@babel/plugin-transform-modules-commonjs'
import fse from 'fs-extra'
import { join } from 'path'
import { writeFile } from 'fs/promises'

const __dirname = getDirname(import.meta)

const babelPluginTransformModules = babel.createConfigItem(transformModules.default)

const cjsPackageJson = {
  type: 'commonjs'
}
const rootDir = join(__dirname, '../')
const transform = async dirs => {
  await Promise.all(dirs
    .map(dir => join(rootDir, dir))
    .map(async dir => {
      const indexPath = join(dir, 'index.js')
      const testPath = join(dir, 'mjs-test.js')
      const cjsDir = join(dir, '_cjs')
      const packageJsonPath = join(cjsDir, 'package.json')
      const cjsIndexPath = join(cjsDir, 'index.js')
      const cjsTestPath = join(cjsDir, 'index.test.js')

      const transformer = from => {
        if (from === './index.js') {
          return from
        }
        if (from.startsWith('./')) {
          return `.${from}`
        }
        if (from.startsWith('../')) {
          return `../${from}`
        }
        return from
      }
      const transformFile = async file => (await babel.transformFileAsync(file, {
        plugins: [
          transformImports(transformer),
          babelPluginTransformModules
        ],
        sourceMaps: 'inline',
        sourceFileName: file
      })).code

      const indexCode = transformFile(indexPath)
      const testCode = transformFile(testPath)

      const writeCode = async (path, codePromise) => await writeFile(path, await codePromise)

      await fse.ensureDir(cjsDir)
      await Promise.all([
        fse.writeJson(packageJsonPath, cjsPackageJson),
        writeCode(cjsIndexPath, indexCode),
        writeCode(cjsTestPath, testCode)
      ])
    })
  )
}

console.log('Building...')
console.time('build')
transform([
  'lib/file-output'
])
  .then(console.timeEnd.bind(undefined, 'build'))
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
