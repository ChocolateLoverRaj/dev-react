/* global afterEach, test, expect */
import Refresher from './refresher.js'
import sinon from 'sinon'

const getFake = () => sinon.fake(() => Promise.resolve())

const fake1 = getFake()
const fake2 = getFake()
const fake3 = getFake()

afterEach(() => {
  fake1.resetHistory()
  fake2.resetHistory()
  fake3.resetHistory()
})

test('first', () => {
  const refresher = new Refresher()
  refresher.refresh(fake1)
  expect(fake1.calledOnce).toBe(true)
})

test('next', async () => {
  const refresher = new Refresher()
  refresher.refresh(fake1)
  refresher.refresh(fake2)
  expect(fake1.calledOnce).toBe(true)
  expect(fake2.notCalled).toBe(true)
  await fake1.getCall(0).returnValue
  expect(fake2.calledOnce).toBe(true)
})

test('overwrite next', async () => {
  const refresher = new Refresher()
  refresher.refresh(fake1)
  refresher.refresh(fake2)
  refresher.refresh(fake3)
  expect(fake1.calledOnce).toBe(true)
  expect(fake2.notCalled).toBe(true)
  expect(fake3.notCalled).toBe(true)
  await fake1.getCall(0).returnValue
  expect(fake2.notCalled).toBe(true)
  expect(fake3.calledOnce).toBe(true)
})
