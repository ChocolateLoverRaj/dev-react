import TextAddon, { _reset as resetTextAddon } from './text.js'
import Addon from './addon.js'

afterEach(resetTextAddon)

test('extends addon', () => {
  const addon = new TextAddon()
  expect(addon).toBeInstanceOf(Addon)
})

test('_reset', () => {
  const addon = new TextAddon()
  addon.update()
  addon.getText()
  resetTextAddon()
  expect(TextAddon.prototype.update.notCalled).toBe(true)
  expect(TextAddon.prototype.getText.notCalled).toBe(true)
})
