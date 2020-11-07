import Display from '../display.js'

const displayTask = task => {
  const display = new Display()
  const update = () => {
    display.update(task.getLines())
  }
  task.on('update', update)
  update()
}

export default displayTask