/* global test, expect */

import DevReact from './index.js'

test('constructor', () => {
  const devReact = new DevReact('dir')
  expect(devReact).toBeInstanceOf(DevReact)
})

describe('errors', () => {
  test('no new', () => {
    expect(() => {
      DevReact()
    }).toThrowErrorMatchingSnapshot()
  })

  test('bad inputDir', () => {
    expect(() => {
      new DevReact()
    }).toThrowErrorMatchingSnapshot()
    expect(() => {
      new DevReact(69)
    }).toThrowErrorMatchingSnapshot()
    expect(() => {
      new DevReact({})
    }).toThrowErrorMatchingSnapshot()
  })
})

