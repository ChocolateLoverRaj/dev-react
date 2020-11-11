// Testing out tasks
import DisplayTask from './display-task.js'
import CustomTask from './tasks/custom.js'
import HideTask from './extra/hide-task.js'
import TextAddon from './addons/text.js'

const task = new HideTask(new CustomTask(new TextAddon('Task')))

setTimeout(() => {
  task.hidden = true
  task.update()
}, 2000)

new DisplayTask(task)
