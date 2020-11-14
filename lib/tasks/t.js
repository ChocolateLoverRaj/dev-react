// Testing out tasks
import Display from '../display.js'

const display = new Display()

display.update([
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10'
])

setTimeout(async () => {
  //*
  await display.update([
    'Some',
    'Text'
  ])//*/
  //*
  await display.update([
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8'
  ])//*/
  console.log(display.log)
}, 2000)
