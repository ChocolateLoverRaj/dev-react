/* global test, expect */

import ErrorWrapper from './error.js'

test('constructing', () => {
  const error = new Error('this will be wrapped')
  error.stack = 'This is for snapshot testing to be consistent.'
  const errorWrapper = new ErrorWrapper('something didn\'t work', error)
  expect(errorWrapper.originalError).toBe(error)
  expect(errorWrapper.message).toMatchSnapshot()
})
