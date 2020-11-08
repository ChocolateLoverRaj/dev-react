// Display lines of text on the terminal, and update them efficiently
import Refresher from './refresher.js'
import { once } from 'events'

const andDrain = async noWait => noWait
  ? undefined
  : await once(process.stdout, 'drain')

class Display {
  constructor () {
    this.refresher = new Refresher()
    this.lines = []
    this.cursorX = 0
    this.cursorY = 0
  }

  async moveCursorX (x) {
    if (this.cursorX === x) {
      return
    }
    await andDrain(process.stdout.cursorTo(x))
    this.cursorX = x
  }

  async moveCursorY (y) {
    if (this.cursorY === y) {
      return
    }
    await andDrain(process.stdout.moveCursor(0, y - this.cursorY))
    this.cursorY = y
  }

  async update (lines) {
    // Update the existing lines
    await this.refresher.refresh(async () => {
      const updateLines = Math.min(lines.length, this.lines.length)
      let i = 0
      for (; i < updateLines; i++) {
        if (lines[i] === this.lines[i]) {
          continue
        }
        await this.moveCursorY(i)
        await this.moveCursorX(0)
        await andDrain(process.stdout.clearLine())
        await andDrain(process.stdout.write(lines[i]))
        this.cursorX = lines[i].length
      }
      await this.moveCursorY(i)

      // Add new lines
      const addLines = lines.length - this.lines.length
      if (addLines > 0) {
        // Add new lines
        await this.moveCursorX(0)
        for (; i < lines.length; i++) {
          await andDrain(process.stdout.write(lines[i]))
          await andDrain(process.stdout.write('\n'))
        }
        this.cursorY = lines.length
      } else if (addLines < 0) {
        // Delete lines
        for (let line = this.lines.length; line >= i; line--) {
          await this.moveCursorY(line)
          await andDrain(process.stdout.clearLine())
        }
        this.cursorY = i
      }
      // Set lines
      this.lines = lines
    })
  }

  async close () {
    await this.update([])
  }
}

export default Display
