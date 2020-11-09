// Testing out tasks
import DisplayTask from './display-task.js'
import CustomTask from './tasks/custom.js'
import TextAddon from './addons/text.js'
import SetAddon from './addons/set.js'

const addon1 = new TextAddon('C')
const addon2 = new TextAddon('E')
const addon = new SetAddon(addon1, addon2)

const task = new CustomTask(addon)

setTimeout(() => {
  const addon3 = new TextAddon('R')
  addon.add(addon3)
  addon.update()

  setTimeout(() => {
    addon3.text = 'Reasoning'
    addon.update()
  }, 2000)
}, 2000)

new DisplayTask(task)
