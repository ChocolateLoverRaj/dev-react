import Refresher from './refresher'

declare class Display {
  refresher: Refresher
  lines: Array<string>
  cursorY: number
  lastLine: number

  moveCursorY(y: number): Promise<void>
  update(lines: Array<string>): Promise<void>
  close(): Promise<void>
}

export default Display
