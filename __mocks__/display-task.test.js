/* eslint-env jest */
import { ColorAddon, DisplayTask } from './display-task.js'
import { ColorAddon as RealColorAddon } from 'display-task'
import MockDisplayTask from '../test-lib/mock-display-task/display-task.js'

test('normal exports', () => {
  expect(ColorAddon).toBe(RealColorAddon)
})

test('DisplayTask', () => {
  expect(DisplayTask).toBe(MockDisplayTask)
})
