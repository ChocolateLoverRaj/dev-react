// Testing out tasks
import DisplayTask from './display-task.js'
import CustomTask from './tasks/custom.js'
import ConcatTask from './tasks/concat.js'
import TextAddon from './addons/text.js'
import StateAddon from './extra/state-addon.js'
import AutoStateAddon from './extra/auto-state-addon.js'

const addon1 = new StateAddon(new TextAddon('Task 1'))
const addon2 = new StateAddon(new TextAddon('Task 2'))
const headAddon = new AutoStateAddon(new TextAddon('Do Tasks'), addon1, addon2)

const task = new ConcatTask(
  new CustomTask(headAddon),
  new CustomTask(addon1),
  new CustomTask(addon2)
)

setTimeout(() => {
  addon1.state = 'complete'
  addon1.update()

  setTimeout(() => {
    addon2.state = 'complete'
    addon2.update()
  }, 2000)
}, 2000)

new DisplayTask(task)
