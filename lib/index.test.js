/* global test, expect */

import DevReact from './index.js'

test('constructor', () => {
  const devReact = new DevReact('dir')
  expect(devReact).toBeInstanceOf(DevReact)
})

test('start', async () => {
  const devReact = new DevReact('dir')
  await devReact.start()
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

  test('start', async () => {
    const devReact = new DevReact('dir')
    await expect(devReact.start()).rejects.toMatchSnapshot()
  })
})
