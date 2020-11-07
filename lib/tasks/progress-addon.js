import BaseAddon from './base-addon.js'

class ProgressAddon extends BaseAddon {
  constructor () {
    super()
    this.progress = 0
    this.styles = {}
  }
  transformLine (line) {
    const progress = Math.floor(this.progress * line.length)
    line = [...line]
    line.splice(0, progress, '-'.repeat(progress))
    line = line.join('')
    return { line, styles: [{ start: 0, end: progress, styles: this.styles }] }
  }
}

export default ProgressAddon
