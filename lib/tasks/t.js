// Testing out tasks
import DisplayTask from './display-task.js'
import CustomTask from './tasks/custom.js'
import TextAddon from './addons/text.js'
import SetTask from './tasks/set.js'

const addon1 = new TextAddon('Task 1')
const task1 = new CustomTask(addon1)

const addon2 = new TextAddon('Task 2')
const task2 = new CustomTask(addon2)

const task = new SetTask(task1, task2)

setTimeout(() => {
  const addon3 = new TextAddon('Task 3')
  const task3 = new CustomTask(addon3)
  task.add(task3)
  task.update()

  setTimeout(() => {
    addon3.text = 'Task 3 - Completed'
    addon3.update()
  }, 2000)
}, 2000)

new DisplayTask(task)
