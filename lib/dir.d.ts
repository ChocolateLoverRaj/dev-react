import NameTask from './tasks/name-task'
import { FSWatcher } from 'chokidar'

declare class Dir {
  constructor(inputDir: string, name: string)

  name: string
  page: string
  task: NameTask
  chokidar: FSWatcher

  destroy(): Promise<void>
}

export default Dir
