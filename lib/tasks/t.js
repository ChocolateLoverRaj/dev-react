// Testing out tasks
import DisplayTask from './display-task.js'
import CustomTask from './tasks/custom.js'
import TextAddon from './addons/text.js'

const addon = new TextAddon('hi')
const task = new CustomTask(addon)

new DisplayTask(task)
