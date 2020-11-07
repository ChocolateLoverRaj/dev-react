// Keep track of tasks
import CustomTask from './tasks/custom-task.js'
import EndAddon from './tasks/end-addon.js'
import NameAddon from './tasks/name-addon.js'
import displayTask from './tasks/display-task.js'

const endAddon = new EndAddon('\u26A0')
const nameAddon = new NameAddon('Warning', 3)
const customTask = new CustomTask(endAddon, nameAddon)
customTask.styles.color = 'yellow'

displayTask(customTask)
