import RealAddon from '../addon.js'
import EventEmitter from '../../../../__mocks__/eventemitter3.js'
import sinon from 'sinon'

class Addon {
  constructor () {
    this.emitter = new EventEmitter()
  }
}
Addon.prototype.update = sinon.fake(RealAddon.prototype.update)
Addon.prototype.getText = sinon.fake(() => '')

export const _reset = () => {
  Addon.prototype.update.resetHistory()
  Addon.prototype.getText.resetHistory()
}

export default Addon
