const { mock } = require('jest-mock-imports')

exports.process = mock({
  modules: new Map()
    .set('fs', 'fs.js')
    .set('fs/promises', 'fs-promises.js')
    .set('chokidar', 'chokidar.js')
    .set('fs-extra', 'fs-extra.js')
    .set('display-task', 'display-task.js'),
  files: new Set()
    .add('lib/normalize.js')
    .add('lib/read-create-dir.js')
    .add('lib/output-dir.js')
    .add('lib/dirs.js')
    .add('lib/tasks/display.js')
    .add('lib/tasks/display-task.js')
})
