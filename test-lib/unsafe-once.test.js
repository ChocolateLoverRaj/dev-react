/* global test, expect */

import unsafeOnce from './unsafe-once.js'
import { once, EventEmitter } from 'events'

test('without error', async () => {
  const emitter = new EventEmitter()
  const oncePromise = once(emitter, 'event')
  const unsafeOncePromise = unsafeOnce(emitter, 'event')
  const firstArg = 'first arg'
  const secondArg = 'second arg'
  emitter.emit('event', firstArg, secondArg)
  const argArr = [firstArg, secondArg]
  expect(await oncePromise).toEqual(argArr)
  expect(await unsafeOncePromise).toEqual(argArr)
})

test('with error', async () => {
  const emitter = new EventEmitter()
  const oncePromise = once(emitter, 'event').catch(e => e)
  const unsafeOncePromise = unsafeOnce(emitter, 'event')
  const error = new Error('Error')
  emitter.emit('error', error)
  const firstArg = 'first arg'
  const secondArg = 'second arg'
  emitter.emit('event', firstArg, secondArg)
  expect(await oncePromise).toBe(error)
  expect(await unsafeOncePromise).toEqual([firstArg, secondArg])
})
