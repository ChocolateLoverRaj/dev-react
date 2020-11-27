// Concatenates multiple addons
import Addon from './addon.js'

class ConcatAddon extends Addon {
  constructor (...addons) {
    super()

    // Set the addons for later use
    this.addons = addons

    // Forward any update events
    const update = () => {
      this.update()
    }
    addons.forEach(addon => {
      addon.emitter.on('update', update)
    })
  }

  getText () {
    // Use array.join('') to concat strings
    return this.addons.map(addon => addon.getText()).join('')
  }
}

export default ConcatAddon
