// Testing out tasks
import DisplayTask from './display-task.js'
import CustomTask from './tasks/custom.js'
import TextAddon from './addons/text.js'
import SortSetTask from './tasks/sort-set.js'
import SetTask from './tasks/set.js'

const task1 = new CustomTask(new TextAddon('333'))
const task2 = new CustomTask(new TextAddon('1'))

const set = new SetTask(task1, task2)
const task = new SortSetTask(set, (a, b) => a.addon.text.length - b.addon.text.length)

setTimeout(() => {
  const task3 = new CustomTask(new TextAddon('22'))
  set.add(task3)
  set.update()
}, 2000)

new DisplayTask(task)
