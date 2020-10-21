const { transformSync } = require('@babel/core')
const { join, relative, dirname } = require('path')

const mocksPath = join(__dirname, './__mocks__')

module.exports = {
  process (src, filename) {
    const transformer = path => {
      switch (path) {
        case 'fs':
          return relative(dirname(filename), join(mocksPath, 'fs.js'))
        case 'fs/promises':
          return relative(dirname(filename), join(mocksPath, 'fs-promises.js'))
        default:
          return path
      }
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
