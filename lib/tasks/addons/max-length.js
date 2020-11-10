// Makes sure that a Addon is not longer than a certain length
import Addon from './addon.js'
import stripAnsi from 'strip-ansi'

class MaxLengthAddon extends Addon {
  constructor (addon, maxLength) {
    super()

    // Set the addon and maxLength for later use
    this.addon = addon
    this.maxLength = maxLength

    // Forward update events for addon
    addon.emitter.on('update', () => {
      this.update()
    })
  }
  getText () {
    // Use String.prototype.slice() to ensure max length
    // FIXME: Breaks with ansi colors because the length is greater than the actual length
    return this.addon.getText().slice(0, this.maxLength)
  }
}

export default MaxLengthAddon