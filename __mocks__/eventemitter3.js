import EE from 'eventemitter3'
import sinon from 'sinon'

class EventEmitter extends EE { }

EventEmitter.prototype.on = sinon.fake(EE.prototype.on)
EventEmitter.prototype.off = sinon.fake(EE.prototype.off)

export const _reset = () => {
  EventEmitter.prototype.on.resetHistory()
  EventEmitter.prototype.off.resetHistory()
}

export default EventEmitter
