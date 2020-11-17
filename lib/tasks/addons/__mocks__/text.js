import Addon from './addon.js'
import { _reset as resetAddon } from './addon.js'
import sinon from 'sinon'

class TextAddon extends Addon {
  constructor (text) {
    super()
    this.text = text
  }
}
TextAddon.prototype.getText = sinon.fake(function () {
  return this.text
})

export const _reset = () => {
  resetAddon()
  TextAddon.prototype.getText.resetHistory()
}

export default TextAddon
