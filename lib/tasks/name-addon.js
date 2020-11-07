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
    let name = this.name
    if (this.margin + name.length > line.length) {
      name = [...name]
      name.splice(line.length - this.margin - 3/*3 because '...'.length is 3*/, Infinity, '...')
      name = name.join('')
    }
    line.splice(this.margin, name.length, name)
    line = line.join('')
    return { line, styles: [{ start: this.margin, end: this.margin + name.length, styles: this.styles }] }
  }
}

export default NameAddon
