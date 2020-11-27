import realNormalize from '../normalize.js'
import sinon from 'sinon'

const normalize = sinon.fake(realNormalize)

export const _reset = () => {
  normalize.resetHistory()
}

export default normalize
