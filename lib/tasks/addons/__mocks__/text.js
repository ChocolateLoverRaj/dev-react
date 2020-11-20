import Addon from './addon.js'
import sinon from 'sinon'

class TextAddon extends Addon {
  constructor () {
    super()
    this.text = 'text'
  }
}
TextAddon.prototype.getText = sinon.fake(function () {
  return this.text
})

export const _reset = () => {
  TextAddon.prototype.getText.resetHistory()
}

export default TextAddon
