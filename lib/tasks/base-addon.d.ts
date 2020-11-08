import EventEmitter from 'eventemitter3'

interface Style {
  start: number
  end: number
  styles: object
}

interface Transformation {
  line: string,
  styles: Array<Style>
}

interface Events {
  update: () => {}
}

declare class BaseAddon extends EventEmitter<Events>{
  update(): void
  transformLine(line: string): Transformation
}

export default BaseAddon
