import Refresher from './refresher'

type lines = Array<string>

declare class Display {
  refresher: Refresher
  lines: lines

  update(lines: lines): void
}

export default Display
