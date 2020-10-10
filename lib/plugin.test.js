/* global test, expect */

import createPlugin from './plugin.js'

import babel from '@babel/core'

test('transform', async () => {
  const inputCode = `
import React from 'react'
import { a, b } from 'something'
import * as m from 'stuff'
import keepDoubleQuotes from "double-quotes"
import keepSingleQuotes from 'single-quotes'

import DoNotChange from 'unchanged'
  `
  const { code } = await babel.transformAsync(inputCode, {
    plugins: [createPlugin(new Map()
      .set('react', '/scripts/react.js')
      .set('something', 'something-else')
      .set('stuff', 'some-stuff')
      .set('double-quotes', 'd-quotes')
      .set('single-quotes', 's-quotes')
    )]
  })
  expect(code).toMatchSnapshot()
})
