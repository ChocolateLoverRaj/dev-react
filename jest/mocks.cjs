module.exports = {
  modules: new Map()
    .set('fs', 'fs.js')
    .set('fs/promises', 'fs-promises.js')
    .set('chokidar', 'chokidar.js')
    .set('fs-extra', 'fs-extra.js'),
  files: new Set()
    .add('lib/normalize.js')
    .add('lib/tasks/display.js')
    .add('lib/read-create-dir.js')
}
