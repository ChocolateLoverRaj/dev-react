import CustomTask from '../tasks/tasks/custom'
import TextAddon from '../tasks/addons/text'
import { SinonSpy } from 'sinon'

export declare function _reset(): void

declare class OutputDir {
  constructor(path: string)

  path: string
  task: CustomTask<TextAddon>
  empty: SinonSpy<Array<unknown>, Promise<void>>
  createDir: SinonSpy<Array<unknown>, Promise<void>>
  removeDir: SinonSpy<Array<unknown>, Promise<void>>
  destroy: SinonSpy<Array<unknown>, Promise<void>>
}

export default OutputDir
