// Spy wrapped
import readCreateDir from '../read-create-dir.js'
import sinon from 'sinon'

const spy = sinon.spy(readCreateDir)

export const _reset = () => {
  spy.resetHistory()
}

export default spy
