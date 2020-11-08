import chalk from 'chalk'

interface Styles {
  color?: typeof chalk.ForegroundColor,
  bgColor?: typeof chalk.ForegroundColor
}

declare const defaultStyles: Styles

export default defaultStyles
