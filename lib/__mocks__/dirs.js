import { CustomTask, TextAddon } from 'display-task'
import sinon from 'sinon'

class Dirs extends Map {
  constructor () {
    super()
    this.task = new CustomTask(new TextAddon('Dirs'))
  }
}
Dirs.prototype.set = sinon.spy()
Dirs.prototype.delete = sinon.spy()
Dirs.prototype.destroy = sinon.spy(async () => {
})

export const _reset = () => {
  Dirs.prototype.set.resetHistory()
  Dirs.prototype.delete.resetHistory()
  Dirs.prototype.destroy.resetHistory()
}

export default Dirs
