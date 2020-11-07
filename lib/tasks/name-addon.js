// Display text
import BaseAddon from './base-addon.js'

class NameAddon extends BaseAddon {
  constructor (name = 'A Task', margin = 0) {
    super()
    this.name = name
    this.margin = margin
    this.styles = {}
  }
  transformLine (line) {
    line = [...line]
    line.splice(this.margin, this.name.length, this.name)
    line = line.join('')
    return { line, styles: [{ start: this.margin, end: this.margin + this.name.length, styles: this.styles }] }
  }
}

export default NameAddon
