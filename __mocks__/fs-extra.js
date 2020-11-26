import { unlinkFile } from '../test-lib/files.js'
import sinon from 'sinon'

const fsExtra = {}

fsExtra.remove = sinon.spy(async path => {
  unlinkFile(path)
})

export const _reset = () => {
  fsExtra.remove.resetHistory()
}

export default fsExtra
