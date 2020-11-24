import sinon from 'sinon'

class Display { }
Display.prototype.update = sinon.fake(async () => { })
Display.prototype.close = sinon.fake(async () => { })

export const _reset = () => {
  Display.prototype.update.resetHistory()
  Display.prototype.close.resetHistory()
}

export default Display
