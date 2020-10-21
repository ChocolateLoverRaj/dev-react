const { transformSync } = require('@babel/core')
const { join, relative, dirname } = require('path')

const mocksPath = join(__dirname, './__mocks__')

module.exports = {
  process (src, filename) {
    const transformer = path => {
      switch (path) {
        // TODO: move this file into a dir
        // TODO: Use a map of different mocks instead of a big switch/case
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
