import BaseTask from './base-task.js'
import defaultStyles from './default-styles.js'
import chalk from 'chalk'

class CustomTask extends BaseTask {
  constructor (...addons) {
    super()
    this.styles = {}
    this.addons = addons
    this.addons.forEach(addon => {
      addon.on('update', () => {
        this.update()
      })
    })
  }
  getLines (styles = {}) {
    styles = {
      ...defaultStyles,
      ...styles,
      ...this.styles
    }
    let lineStyles = [{
      start: 0,
      end: process.stdout.columns - 1,
      styles
    }]
    let line = ' '.repeat(process.stdout.columns - 1)
    this.addons.forEach(addon => {
      const transformedLine = addon.transformLine(line)
      line = transformedLine.line
      lineStyles.push(...transformedLine.styles)
    })
    let styledLine = [...line].map((char, index) => {
      let charStyle = Object.assign({}, ...lineStyles.map(
        ({ start, end, styles }) => start <= index && end > index
          ? styles
          : {}
      ))
      return chalk.keyword(charStyle.color).bgKeyword(charStyle.bgColor)(char)
    }).join('')
    return [styledLine]
  }
}

export default CustomTask