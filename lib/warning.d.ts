import {
  CustomTask,
  TextAddon,
  ColorAddon
} from 'display-task'

declare function warning(warning: string, filename: string): CustomTask<ColorAddon<TextAddon>>

export default warning
