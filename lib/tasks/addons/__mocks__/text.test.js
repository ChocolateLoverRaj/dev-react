import TextAddon, { _reset as resetTextAddon } from './text.js'
import Addon from './addon.js'

afterEach(resetTextAddon)

test('extends addon', () => {
  const addon = new TextAddon()
  expect(addon).toBeInstanceOf(Addon)
})

test('text property', () => {
  expect(new TextAddon().text).toMatchSnapshot()
})

test('_reset', () => {
  const addon = new TextAddon()
  addon.getText()
  resetTextAddon()
  expect(TextAddon.prototype.getText.notCalled).toBe(true)
})
