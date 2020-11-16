import CustomTask from './tasks/tasks/custom.js'
import TextAddon from './tasks/addons/text.js'
import ColorAddon from './tasks/addons/color.js'

declare function warning(warning: string, filename: string): CustomTask<ColorAddon<TextAddon>>

export default warning
