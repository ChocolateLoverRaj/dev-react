// Keep track of tasks
import CustomTask from './tasks/custom-task.js'
import EndAddon from './tasks/end-addon.js'
import displayTask from './tasks/display-task.js'

const endAddon = new EndAddon('\u26A0')
endAddon.styles.color = 'yellow'
const customTask = new CustomTask(endAddon)

displayTask(customTask)
