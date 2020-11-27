import CustomTask from '../tasks/tasks/custom'
import TextAddon from '../tasks/addons/text'
import { SinonSpy } from 'sinon'

export declare function _reset(): void

declare class Dirs extends Map {
  task: CustomTask<TextAddon>
  set: SinonSpy<Array<unknown>, void>
  delete: SinonSpy<Array<unknown>, void>
  destroy: SinonSpy<Array<unknown>, Promise<void>>
}

export default Dirs
