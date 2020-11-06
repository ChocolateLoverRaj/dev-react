// Display lines of text on the terminal, and update them efficiently
import Refresher from './refresher.js'
import { once } from 'events'

if (!process.stdout.isTTY) {
  throw new Error('non-tty output is not supported')
}

const onceDrain = () => once(process.stdout, 'drain')

class Display {
  constructor () {
    this.refresher = new Refresher()
    this.lines = []
  }

  update (lines) {
    this.refresher.refresh(async () => {
      if (!process.stdout.moveCursor(0, -this.lines.length)) {
        await onceDrain()
      }
      for (let row = 0; row < lines.length; row++) {
        if (!process.stdout.cursorTo(0)) {
          await onceDrain()
        }
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
              if (!process.stdout.cursorTo(column)) {
                await onceDrain()
              }
              skipped = false
            }
            if (!process.stdout.write(newChar)) {
              await onceDrain()
            }
          }
          if (!process.stdout.moveCursor(0, 1)) {
            await onceDrain()
          }
          continue
        }
        if (!process.stdout.write(lines[row])) {
          await onceDrain()
        }
        if (!process.stdout.write('\n')) {
          await onceDrain()
        }
      }
      if (this.lines.length > lines.length) {
        for (let row = this.lines.length; row > lines.length; row--) {
          if (!process.stdout.clearLine()) {
            await onceDrain()
          }
          if (!process.stdout.moveCursor(0, -1)) {
            await onceDrain()
          }
        }
      }
      this.lines = lines
    })
  }
}

export default Display
