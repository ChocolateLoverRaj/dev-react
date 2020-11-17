import TextAddon, { _reset as resetTextAddon } from './text.js'
import Addon, { _reset as resetAddon } from './addon.js'

afterEach(resetTextAddon)

test('extends addon', () => {
  const addon = new TextAddon()
  expect(addon).toBeInstanceOf(Addon)
})

test('_reset', () => {
  expect(resetTextAddon).toBe(resetAddon)
})
