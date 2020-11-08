// Queue updates efficiently
import EventEmitter from 'eventemitter3'
import { once } from 'events'

class Refresher {
  constructor () {
    this.running = false
    this.emitter = new EventEmitter()
  }

  run (func) {
    this.running = true
    delete this.next
    func().then(() => {
      this.running = false
      this.emitter.emit('done')
      if (this.next) {
        this.run(this.next)
      }
    })
  }

  async refresh (func) {
    if (this.running) {
      this.next = func
      await once(this.emitter, 'done')
      await once(this.emitter, 'done')
      return
    }
    this.run(func)
    await once(this.emitter, 'done')
  }
}

export default Refresher
