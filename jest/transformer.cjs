const mocks = require('./mocks.cjs')
const { transformSync } = require('@babel/core')
const { join, relative, dirname, basename } = require('path')

const mocksPath = join(__dirname, '../__mocks__')
const basePath = join(__dirname, '../')

const mockFiles = new Set([...mocks.files].map(path => join(basePath, path)))

module.exports = {
  process (src, filename) {
    const transformer = path => {
      if (path.startsWith('.')) {
        const fileDir = dirname(filename)
        if (basename(fileDir) !== '__mocks__') {
          const file = join(fileDir, path)
          if (!filename.endsWith('.test.js') && mockFiles.has(file)) {
            const relativePath = relative(fileDir, join(dirname(file), './__mocks__/', basename(file)))
            return relativePath.startsWith('.') ? relativePath : `.${relativePath}`
          }
        }
      } else if (mocks.modules.has(path)) {
        const replaceFile = join(mocksPath, mocks.modules.get(path))
        if (filename !== replaceFile) {
          return relative(dirname(filename), replaceFile)
        }
      }
      return path
    }

    return transformSync(src, {
      plugins: [{
        visitor: {
          ImportDeclaration (path) {
            path.node.source.value = transformer(path.node.source.value)
          },
          ExportNamedDeclaration (path) {
            if (path.node.source) {
              path.node.source.value = transformer(path.node.source.value)
            }
          },
          ExportAllDeclaration (path) {
            path.node.source.value = transformer(path.node.source.value)
          }
        }
      }]
    })
  }
}
