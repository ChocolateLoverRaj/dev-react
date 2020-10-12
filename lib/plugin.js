// My babel plugin which changes 'react' imports to '/scripts/react.js'
const createPlugin = map => ({
  visitor: {
    ImportDeclaration ({ node: { source } }) {
      if (map.has(source.value)) {
        source.extra.raw = source.extra.raw.replace(source.value, map.get(source.value))
      }
    }
  }
})

export default createPlugin
