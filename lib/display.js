// Display lines of text on the terminal, and update them efficiently
import Refresher from './refresher.js'

if (!process.stdout.isTTY) {
  throw new Error('non-tty output is not supported')
}

class Display {
  constructor () {
    this.refresher = new Refresher()
    this.lines = []
  }

  update (lines) {
    this.refresher.refresh(async () => {
      process.stdout.moveCursor(0, -this.lines.length)
      for (let row = 0; row < lines.length; row++) {
        process.stdout.cursorTo(0)
        if (row < this.lines.length) {
          const oldRow = this.lines[row]
          const newRow = lines[row]
          let skipped = false
          for (let column = 0; column < newRow.length; column++) {
            const oldChar = oldRow.charAt(column)
            const newChar = newRow.charAt(column)
            if (oldChar === newChar) {
              skipped = true
              continue
            }
            if (skipped) {
              process.stdout.cursorTo(column)
              skipped = false
            }
            process.stdout.write(newChar)
          }
          process.stdout.moveCursor(0, 1)
          continue
        }
        process.stdout.write(lines[row])
        process.stdout.write('\n')
      }
      if (this.lines.length > lines.length) {
        for (let row = this.lines.length; row > lines.length; row--) {
          process.stdout.clearLine()
          process.stdout.moveCursor(0, -1)
        }
      }
      this.lines = lines
    })
  }
}

export default Display
