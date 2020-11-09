// Testing out tasks
import DisplayTask from './display-task.js'
import CustomTask from './tasks/custom.js'
import TextAddon from './addons/text.js'
import ColorAddon from './addons/color.js'

const addon = new TextAddon('hi')
const color = new ColorAddon(addon, 'blue')
const task = new CustomTask(color)

setTimeout(() => {
  addon.text = 'hello'
  addon.update()
}, 2000)

new DisplayTask(task)
