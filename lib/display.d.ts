import Refresher from './refresher'

type lines = Array<string>

declare class Display {
  refresher: Refresher
  lines: lines
  cursorX: number
  cursorY: number

  moveCursorX(x: number): Promise<void>
  moveCursorY(y: number): Promise<void>
  update(lines: lines): Promise<void>
  close(): Promise<void>
}

export default Display
