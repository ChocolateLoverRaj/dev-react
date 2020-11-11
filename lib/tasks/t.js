// Testing out tasks
import DisplayTask from './display-task.js'
import CustomTask from './tasks/custom.js'
import TextAddon from './addons/text.js'
import StateAddon from './extra/state-addon.js'

const addon = new StateAddon(new TextAddon('Do something cool'))

const task = new CustomTask(addon)

setTimeout(() => {
  addon.state = 'failed'
  addon.update()
}, 2000)

new DisplayTask(task)
