// Testing out tasks
import DisplayTask from './display-task.js'
import CustomTask from './tasks/custom.js'
import TextAddon from './addons/text.js'
import ConcatTask from './tasks/concat.js'

const addon1 = new TextAddon('Task 1')
const task1 = new CustomTask(addon1)

const addon2 = new TextAddon('Task 2')
const task2 = new CustomTask(addon2)

const task = new ConcatTask(task1, task2)

setTimeout(() => {
  addon1.text = 'Task 1 - Completed'
  addon1.update()
}, 1000)

new DisplayTask(task)
