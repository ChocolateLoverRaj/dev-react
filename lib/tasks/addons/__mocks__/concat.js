import Addon from './addon.js'
import sinon from 'sinon'

export const _func = sinon.fake()

class ConcatAddon extends Addon {
  constructor (...addons) {
    super()
    _func(...arguments)
    this.addons = addons
  }
}
ConcatAddon.prototype.getText = sinon.fake(function () {
  return this.addons.map(addon => addon.getText()).join('')
})

export const _reset = () => {
  _func.resetHistory()
  ConcatAddon.prototype.getText.resetHistory()
}

export default ConcatAddon
