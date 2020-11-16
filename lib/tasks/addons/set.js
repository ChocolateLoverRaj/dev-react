// Manage a Set() of addons. This is useful for having a dynamic list of addons.
import Addon from './addon.js'
import ConcatAddon from './concat.js'

// Methods for manipulating tasks should follow the Set() prototype for consistency.
class SetAddon extends Addon {
  constructor (...addons) {
    super()

    // Set() of addons
    this.addons = new Set()

    // Add all the tasks
    addons.forEach(addon => {
      this.add(addon)
    })
  }
  getText () {
    // Create a ConcatAddon from current addons
    return new ConcatAddon(...this.addons).getText()
  }
  add (addon) {
    // Add the addon to the Set() of addons
    this.addons.add(addon)

    // Forward events for the addon
    addon.emitter.on('update', () => {
      this.update()
    })
  }
}

export default SetAddon
