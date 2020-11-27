/* global afterEach, test, expect */

import OutputDir, { _reset } from './output-dir.js'

afterEach(_reset)

const testSpy = (method, callback) => {
  const outputDir = new OutputDir()
  const arg = 'page'
  const result = outputDir[method](arg)
  expect(OutputDir.prototype[method].calledOnceWith(arg)).toBe(true)
  if (callback) {
    result.then(callback)
  }
}

test('constructor', () => {
  const outputDir = new OutputDir('dev')
  expect(outputDir.path).toBe('dev')
  expect(outputDir.task.getLines()).toStrictEqual(['Output Dir'])
})

test('empty', () => {
  testSpy('empty')
})

test('createDir', callback => {
  testSpy('createDir', callback)
})

test('removeDir', callback => {
  testSpy('removeDir', callback)
})

test('destroy', callback => {
  testSpy('destroy', callback)
})

test('_reset', () => {
  const methods = ['empty', 'createDir', 'removeDir', 'destroy']
  const outputDir = new OutputDir()
  for (const method of methods) {
    outputDir[method]()
  }
  _reset()
  for (const method of methods) {
    expect(OutputDir.prototype[method].notCalled).toBe(true)
  }
})
