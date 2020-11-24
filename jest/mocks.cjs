module.exports = {
  modules: new Map()
    .set('fs', 'fs.js')
    .set('fs/promises', 'fs-promises.js')
    .set('chokidar', 'chokidar.js'),
  files: new Set()
    .add('lib/normalize.js')
    .add('lib/tasks/display.js')
}
