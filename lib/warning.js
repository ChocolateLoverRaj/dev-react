// Get a custom task for unrecognized file warnings
import CustomTask from './tasks/tasks/custom.js'
import TextAddon from './tasks/addons/text.js'
import ColorAddon from './tasks/addons/color.js'

const warning = (warning, filename) => {
  return new CustomTask(new ColorAddon(new TextAddon(`\u26a0 ${warning}: ${filename}`), 'yellow'))
}

export default warning
