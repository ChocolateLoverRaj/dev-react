import {
  Task,
  SetTask,
  SortSetTask
} from 'display-task'

class PagesTask extends Task {
  constructor (pages) {
    super()
    this.pages = pages
  }
  getLines () {
    const setTask = new SetTask(...[...this.pages.values()].map(({ task }) => task))
    const getInt = nameTask => Buffer.from(nameTask.name).readIntBE(nameTask.name.length - 1, 1)
    return new SortSetTask(setTask, (a, b) => getInt(a) - getInt(b)).getLines()
  }
}

export default PagesTask
