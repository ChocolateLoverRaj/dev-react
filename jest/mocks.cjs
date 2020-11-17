module.exports = {
  modules: new Map()
    .set('fs', 'fs.js')
    .set('fs/promises', 'fs-promises.js')
    .set('chokidar', 'chokidar.js')
    .set('chalk', 'chalk.js')
    .set('eventemitter3', 'eventemitter3.js'),
  files: new Set()
    .add('lib/normalize.js')
    .add('lib/tasks/addons/addon.js')
    .add('lib/tasks/addons/text.js')
}
