import CustomTask from '../tasks/tasks/custom.js'
import TextAddon from '../tasks/addons/text.js'
import sinon from 'sinon'

class OutputDir {
  constructor (path) {
    this.path = path
    this.task = new CustomTask(new TextAddon('Output Dir'))
  }
}
OutputDir.prototype.empty = sinon.spy()
OutputDir.prototype.createDir = sinon.spy(async () => {
})
OutputDir.prototype.removeDir = sinon.spy(async () => {
})
OutputDir.prototype.destroy = sinon.spy(async () => {
})

export const _reset = () => {
  OutputDir.prototype.empty.resetHistory()
  OutputDir.prototype.createDir.resetHistory()
  OutputDir.prototype.removeDir.resetHistory()
  OutputDir.prototype.destroy.resetHistory()
}

export default OutputDir
