import EE from 'eventemitter3'
import { SinonSpy } from 'sinon'

export declare function _reset(): void

declare class EventEmitter extends EE {
  on: SinonSpy<Parameters<typeof EE.prototype.on>, typeof EE.prototype.on>
  off: SinonSpy<Parameters<typeof EE.prototype.off>, typeof EE.prototype.off>
}

export default EventEmitter
