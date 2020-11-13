// Testing out tasks
import DisplayTask from './display-task.js'
import CustomTask from './tasks/custom.js'
import ConcatTask from './tasks/concat.js'
import TextAddon from './addons/text.js'
import StateAddon from './extra/state-addon.js'
import AutoStateAddon from './extra/auto-state-addon.js'

const subAddon1 = new StateAddon(new TextAddon('Sub Addon 1'))
const subAddon2 = new StateAddon(new TextAddon('Sub Addon 2'))

const headAddon = new AutoStateAddon(
  new TextAddon('Head Addon'),
  subAddon1,
  subAddon2
)

const task = new ConcatTask(
  new CustomTask(headAddon),
  new CustomTask(subAddon1),
  new CustomTask(subAddon2)
)

const displayTask = new DisplayTask(task)

setTimeout(() => {
  subAddon1.state = 'complete'
  subAddon1.update()
}, 500)

setTimeout(() => {
  subAddon2.state = 'complete'
  subAddon2.update()
}, 1000)

setTimeout(() => {
  displayTask.close()
  subAddon2.update()
}, 1500)
