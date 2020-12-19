/* eslint-env jest */

import warning from './warning.js'

test('colorful task', () => {
  expect(warning('my warning', 'a file').getLines()).toMatchSnapshot()
})
