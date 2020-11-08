import BaseTask from './base-task.js'

class SortGroup extends BaseTask {
  constructor (group) {
    super()
    this.group = group
  }
  getLines (styles) {
    const tasks = [...this.group.tasks]
    this.group.tasks.clear()
    tasks
      .sort((a, b) => {
        return a.name.length - b.name.length
      })
      .forEach(task => {
        this.group.tasks.add(task)
      })
    return this.group.getLines(styles)
  }
}

export default SortGroup
