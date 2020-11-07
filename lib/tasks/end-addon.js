import BaseAddon from './base-addon.js'

class EndAddon extends BaseAddon {
  constructor (text = '', side = 'left') {
    super()
    this.text = text
    this.side = side
    this.styles = {}
  }
  transformLine (line) {
    let start
    let deleteCount = this.text.length
    if (this.side === 'left') {
      start = 0
    } else {
      start = line.length - deleteCount
    }
    line = [...line]
    line.splice(start, deleteCount, ...this.text)
    line = line.join('')
    return { line, styles: [{ start: start, end: start + deleteCount, styles: this.styles }] }
  }
}

export default EndAddon
