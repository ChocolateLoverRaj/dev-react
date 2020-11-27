import sinon from 'sinon'

class DisplayTask {
  constructor () {
    this.constructorArgs = arguments
  }
}
DisplayTask.prototype.close = sinon.spy(async () => {
})

export const _reset = () => {
  DisplayTask.prototype.close.resetHistory()
}

export default DisplayTask
