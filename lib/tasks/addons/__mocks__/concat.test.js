import ConcatAddon, { _func, _reset as resetConcatAddon } from './concat.js'
import TextAddon, { _reset as resetTextAddon } from './text.js'

afterEach(() => {
  resetConcatAddon()
  resetTextAddon()
})

test('constructor', () => {
  const addons = [Symbol(), Symbol()]
  expect(new ConcatAddon(...addons).addons).toStrictEqual(addons)
})

test('getText', () => {
  expect(new ConcatAddon(new TextAddon('a'), new TextAddon('b')).getText()).toBe('ab')
})

test('_func', () => {
  const arg = Symbol()
  new ConcatAddon(arg)
  expect(_func.calledOnceWith(arg)).toBe(true)
})

test('_reset', () => {
  const concatAddon = new ConcatAddon()
  concatAddon.update()
  concatAddon.getText()
  resetConcatAddon()
  expect(_func.notCalled).toBe(true)
  expect(ConcatAddon.prototype.update.notCalled).toBe(true)
  expect(ConcatAddon.prototype.getText.notCalled).toBe(true)
})