import sinon from 'sinon'
import realSliceAnsi from 'slice-ansi'

const sliceAnsi = sinon.fake(realSliceAnsi)

export const _reset = () => {
  sliceAnsi.resetHistory()
}

export default sliceAnsi
