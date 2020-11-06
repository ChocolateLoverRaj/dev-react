// Queue updates efficiently

class Refresher {
  constructor () {
    this.running = false
  }

  run (func) {
    this.running = true
    this.next = null
    func().then(() => {
      this.running = false
      if (this.next) {
        this.run(this.next)
      }
    })
  }

  refresh (func) {
    if (this.running) {
      this.next = func
      return
    }
    this.run(func)
  }
}

export default Refresher
