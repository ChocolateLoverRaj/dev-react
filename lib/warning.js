// Get a custom task for unrecognized file warnings
import {
  CustomTask,
  TextAddon,
  ColorAddon
} from 'display-task'

const warning = (warning, filename) => {
  return new CustomTask(new ColorAddon(new TextAddon(`\u26a0 ${warning}: ${filename}`), 'yellow'))
}

export default warning
