import EE from 'eventemitter3'
import sinon from 'sinon'

class EventEmitter extends EE { }

  EventEmitter.prototype.on = sinon.fake(EE.prototype.on)

export const _reset = () => {
  EventEmitter.prototype.on.resetHistory()
}

export default EventEmitter
