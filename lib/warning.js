// Get a custom task for unrecognized file warnings
import CustomTask from './tasks/tasks/custom.js'
import TextAddon from './tasks/addons/text.js'

const warning = (warning, filename) => {
  return new CustomTask(new TextAddon(`\u26a0 ${warning}: ${filename}`))
}

export default warning
