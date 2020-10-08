/* global test, expect */

import ErrorWrapper from './error.js'

test('constructing', () => {
  const error = new Error('this will be wrapped')
  const errorWrapper = new ErrorWrapper('something didn\'t work', error)
  expect(errorWrapper.message).toBe('something didn\'t work')
  expect(errorWrapper.error).toBe(error)
})
