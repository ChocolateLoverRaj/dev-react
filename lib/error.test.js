/* global test, expect */

import ErrorWrapper from './error.js'

test('constructing', () => {
  const error = new Error('this will be wrapped')
  const errorWrapper = new ErrorWrapper('something didn\'t work', error)
  expect(errorWrapper.originalError).toBe(error)
  expect(errorWrapper.message).toMatchSnapshot()
})
