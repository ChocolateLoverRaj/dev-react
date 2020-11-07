// Keep track of tasks
import NameTask from './tasks/name-task.js'
import GroupTask from './tasks/group-task.js'
import displayTask from './tasks/display-task.js'

const strawberry = new NameTask('strawberry')
const apple = new NameTask('apple')
const red = new GroupTask(strawberry, apple)
red.styles.color = 'red'

const banana = new NameTask('banana')
const pineapple = new NameTask('pineapple')
const yellow = new GroupTask(banana, pineapple)
yellow.styles.color = 'yellow'

displayTask(new GroupTask(red, yellow))
