// Most tasks are either in progress, completed, or failed
import Addon from '../addons/addon.js'
import ColorAddon from '../addons/color.js'

class StateAddon extends Addon {
  constructor (addon) {
    super()

    this.addon = addon
    this.state = 'in progress'

    addon.emitter.on('update', () => {
      this.update()
    })
  }
  getText () {
    // Get a color based on state
    const color = this.state === 'in progress'
      ? 'yellow'
      : this.state === 'complete'
        ? 'green'
        : 'red'
    // Create a ColorAddon with color
    return new ColorAddon(this.addon, color).getText()
  }
}

export default StateAddon
