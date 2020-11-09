// Testing out tasks
import DisplayTask from './display-task.js'
import CustomTask from './tasks/custom.js'
import TextAddon from './addons/text.js'
import ColorAddon from './addons/color.js'
import ConcatAddon from './addons/concat.js'

const checkAddon = new TextAddon('\u26A0  ')
const checkColor = new ColorAddon(checkAddon, 'yellow')
const textAddon = new TextAddon('Warning')
const textColor = new ColorAddon(textAddon, 'red')
const addon = new ConcatAddon(checkColor, textColor)
const task = new CustomTask(addon)

let red
setInterval(() => {
  textColor.color = red ? 'red' : 'yellow'
  textColor.update()
  red = !red
}, 1000)

new DisplayTask(task)
