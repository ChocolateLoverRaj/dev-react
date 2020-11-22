// Automatically changes the state based on children addons
import Addon from '../addons/addon.js'
import StateAddon from './state-addon.js'

class AutoStateAddon extends Addon {
  constructor (headAddon, ...addons) {
    super()

    this.headAddon = headAddon
    this.addons = addons

    const updateHandler = () => {
      this.update()
    }
    headAddon.emitter.on('update', updateHandler)
    for (const addon of addons) {
      addon.emitter.on('update', updateHandler)
    }
  }
  getText () {
    // If a single task has failed, the auto state is failed
    // If all tasks are complete, the auto state is complete
    // Otherwise, this is in progress
    let state = 'complete'
    for (const stateAddon of this.addons) {
      if (stateAddon.state === 'failed') {
        state = 'failed'
        break
      }
      if (stateAddon.state === 'in progress') {
        state = 'in progress'
      }
    }
    // Create a StateAddon
    const addon = new StateAddon(this.headAddon)
    addon.state = state
    return addon.getText()
  }
}

export default AutoStateAddon
