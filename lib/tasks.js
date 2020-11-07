// Keep track of tasks
import CustomTask from './tasks/custom-task.js'
import NameAddon from './tasks/name-addon.js'
import ProgressAddon from './tasks/progress-addon.js'
import displayTask from './tasks/display-task.js'

const progressAddon = new ProgressAddon()
const nameAddon = new NameAddon('Task 1', 50)
const customTask = new CustomTask(progressAddon, nameAddon)
customTask.styles.color = 'green'

const interval = setInterval(() => {
  progressAddon.progress += 0.005
  if (progressAddon.progress >= 1) {
    clearInterval(interval)
    return
  }
  progressAddon.update()
}, 10)

displayTask(customTask)
