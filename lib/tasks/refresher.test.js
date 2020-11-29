/* global afterEach, test, expect */
import Refresher from './refresher.js'
import sinon from 'sinon'
import tick from 'p-immediate'
import noResolve from 'no-resolve'

const getFake = () => sinon.fake(async () => { })

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
  const update1 = refresher.refresh(fake1)
  expect(fake1.calledOnce).toBe(true)
  noResolve(tick(), update1)
})

test('next', async () => {
  const refresher = new Refresher()
  const update1 = refresher.refresh(fake1)
  const update2 = refresher.refresh(fake2)
  expect(fake1.calledOnce).toBe(true)
  expect(fake2.notCalled).toBe(true)
  await noResolve(tick(), update1)
  expect(fake2.calledOnce).toBe(true)
  noResolve(tick(), update2)
})

test('overwrite next', async () => {
  const refresher = new Refresher()
  const update1 = refresher.refresh(fake1)
  const update2 = refresher.refresh(fake2)
  const update3 = refresher.refresh(fake3)
  expect(fake1.calledOnce).toBe(true)
  expect(fake2.notCalled).toBe(true)
  expect(fake3.notCalled).toBe(true)
  await noResolve(tick(), update1)
  expect(fake2.notCalled).toBe(true)
  expect(fake3.calledOnce).toBe(true)
  await Promise.all([
    noResolve(tick(), update2),
    noResolve(tick(), update3)
  ])
})
