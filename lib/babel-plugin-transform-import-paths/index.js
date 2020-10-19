// Transform imports
const transformImports = transformer => ({
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
})

export default transformImports
