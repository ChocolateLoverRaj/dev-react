// Get a custom task for unrecognized file warnings
import CustomTask from './tasks/custom-task.js'
import EndAddon from './tasks/end-addon.js'
import NameAddon from './tasks/name-addon.js'

const warning = (warning, filename) => {
  const endAddon = new EndAddon('\u26a0')
  const nameAddon = new NameAddon(`${warning}: ${filename}`, 3)
  const customTask = new CustomTask(endAddon, nameAddon)
  return customTask
}

export default warning
