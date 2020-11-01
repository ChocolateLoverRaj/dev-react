const mocks = require('./mocks.cjs')
const { transformSync } = require('@babel/core')
const { join, relative, dirname } = require('path')

const mocksPath = join(__dirname, '../__mocks__')

module.exports = {
  process (src, filename) {
    if (filename.endsWith('fs.js')) {
      throw new Error(filename)
    }
    const transformer = path => mocks.has(path)
      ? relative(dirname(filename), join(mocksPath, mocks.get(path)))
      : path

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
