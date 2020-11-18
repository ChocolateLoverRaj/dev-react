import sinon from 'sinon'

const sliceAnsi = sinon.fake()

export const _reset = () => {
  sliceAnsi.resetHistory()
}

export default sliceAnsi
