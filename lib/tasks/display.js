// Display lines of text on the terminal, and update them efficiently
import Refresher from './refresher.js'
import { once } from 'events'

// Wait for process.stdout to be drained if necessary
const andDrain = async noWait => noWait
  ? undefined
  : await once(process.stdout, 'drain')

// The splitter text pattern
// For example, if it was -=,
// And the width was 5,
// it would be -=-=-
const splitterTextPattern = '-='
// The mid splitter text
const midSplitterText = ' Display Updated '
// Get a nice splitter string to print to stdout
const getSplitterText = () => {
  // The margin in the left to fill with splitter text
  const marginLeft = Math.floor((process.stdout.columns - midSplitterText.length) / 2)
  // The right margin
  const marginRight = process.stdout.columns - marginLeft - midSplitterText.length
  // Return left with splitter text, mid splitter text, and right splitter text
  return (
    splitterTextPattern
      // Repeat pattern to fill left margin (rounded up)
      .repeat(Math.ceil(marginLeft / splitterTextPattern.length))
      // Slice of extra
      .slice(0, marginLeft) +
    midSplitterText +
    splitterTextPattern
      // Repeat pattern to fill right margin (rounded up)
      .repeat(Math.ceil(marginRight / splitterTextPattern.length))
      // Slice of extra
      .slice(0, marginRight)
  )
}

class Display {
  constructor () {
    // Used to cancel outdated updates
    this.refresher = new Refresher()
    // Cache of previously displayed lines
    this.lines = []
    // Cursor y position
    this.cursorY = 0
    // The last line drawn
    this.lastLine = 0
  }

  async moveCursorY (y) {
    // Don't do anything if we're already at that y
    if (this.cursorY === y) {
      return
    }
    // The last line we want / can move to
    const lastLine = Math.min(y, this.lastLine)
    // Move to the last line
    await andDrain(process.stdout.moveCursor(0, lastLine - this.cursorY))
    // Use \n to create more lines
    for (let line = lastLine; line < y; line++) {
      await andDrain(process.stdout.write('\n'))
    }
    // Update cursorY
    this.cursorY = y
    // Adjust lastLine because we might've created new lines
    this.lastLine = Math.max(this.lastLine, y)
  }

  async update (lines) {
    // Update the existing lines
    await this.refresher.refresh(async () => {
      // The current line
      let i = 0
      // Old, unchangeable lines
      const historyLines = Math.max(this.lines.length - process.stdout.rows, 0)
      if (historyLines) {
        // If all the unchangeable lines don't need to be changed, no problem
        let noNeed = true
        for (let i = 0; i < historyLines; i++) {
          if (lines[i] !== this.lines[i]) {
            noNeed = false
          }
        }
        if (noNeed) {
          // If there is no need to change history lines, then continue updating, adding, and deleting changeable lines
          i = historyLines
        } else {
          // Move to the very first line, and show that there is a display update
          await this.moveCursorY(0)
          await andDrain(process.stdout.clearLine())
          await this.moveCursorY(1)
          await andDrain(process.stdout.cursorTo(0))
          await andDrain(process.stdout.write(getSplitterText()))
          await andDrain(process.stdout.clearLine(1))
          await this.moveCursorY(2)
          await andDrain(process.stdout.clearLine())
          // Reset cursorY
          this.cursorY = 0
          // Update lastLine
          this.lastLine = 0
          // Update old lines to reflect where they are on screen
          // Add 3 because we add 1 empty line, 1 line with text, and another empty line
          this.lines.splice(0, historyLines + 3)
        }
      }
      // Update existing lines
      const updateLines = Math.min(this.lines.length, lines.length)
      for (; i < updateLines; i++) {
        // If the lines are the same, there is no need to update them
        if (this.lines[i] === lines[i]) {
          continue
        }
        // Move the cursor
        await this.moveCursorY(i)
        await andDrain(process.stdout.cursorTo(0))
        // Write the text
        await andDrain(process.stdout.write(lines[i]))
        // Clear the rest of the line
        await andDrain(process.stdout.clearLine(1))
      }
      // Add or delete lines
      const addLines = lines.length - this.lines.length
      if (addLines > 0) {
        // Add new lines
        for (; i < lines.length; i++) {
          // Move cursor to correct position
          await this.moveCursorY(i)
          // Move cursor x
          await andDrain(process.stdout.cursorTo(0))
          // Write to process.stdout
          await andDrain(process.stdout.write(lines[i]))
        }
        // Update cursor y
        this.cursorY = i - 1
      } else if (addLines < 0) {
        // Delete lines by going to the furthest line and moving backwards
        for (let line = this.lines.length - 1; line >= lines.length; line--) {
          // Move to line
          await this.moveCursorY(line)
          // Clear line
          await andDrain(process.stdout.clearLine())
        }
      }
      // Save lines
      this.lines = lines
    })
  }

  async close () {
    // Delete lines
    await this.update([])
    // Reset cursor x
    await andDrain(process.stdout.cursorTo(0))
  }
}

export default Display
