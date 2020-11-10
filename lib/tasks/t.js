// Testing out tasks
import DisplayTask from './display-task.js'
import TextAddon from './addons/text.js'
import MaxLengthAddon from './addons/max-length.js'
import ColorAddon from './addons/color.js'
import ConcatTask from './tasks/concat.js'
import CustomTask from './tasks/custom.js'

const addon1 = new TextAddon('Happy day')
const addon2 = new TextAddon('A')

const task = new ConcatTask(
  new CustomTask(new MaxLengthAddon(new ColorAddon(addon1, 'magenta'), 10)),
  new CustomTask(new MaxLengthAddon(new ColorAddon(addon2, 'blue'), 10))
)

setTimeout(() => {
  addon1.text = 'Happy Birthday!'
  addon1.update()
}, 2000)

new DisplayTask(task)
