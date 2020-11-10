// Colors text
import Addon from './addon.js'
import chalk from 'chalk'

class ColorAddon extends Addon {
  constructor (addon, color) {
    super()

    // Set the addon and color for future use
    this.addon = addon
    this.color = color

    // Forward the update event for the addon, because this addon depends on it
    addon.emitter.on('update', () => {
      this.update()
    })
  }
  getText () {
    // Use chalk.keyword to get the coloring function and color the text
    return chalk.keyword(this.color)(this.addon.getText())
  }
}

export default ColorAddon
