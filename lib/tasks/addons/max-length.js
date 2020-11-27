// Makes sure that a Addon is not longer than a certain length
import Addon from './addon.js'
import sliceAnsi from 'slice-ansi'

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
    // Use sliceAnsi to ensure max length, while keeping colors
    return sliceAnsi(this.addon.getText(), 0, this.maxLength)
  }
}

export default MaxLengthAddon
