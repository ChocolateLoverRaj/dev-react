// Display text
import Addon from './addon.js'

class TextAddon extends Addon {
  constructor (text) {
    super()
    this.text = text
  }

  getText () {
    return this.text
  }
}

export default TextAddon
