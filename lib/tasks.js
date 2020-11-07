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

const fruits = new GroupTask(red, yellow)
fruits.styles.bgColor = 'black'

const flower1 = new NameTask('flower 1')
const flower2 = new NameTask('flower 2')
const purple = new GroupTask(flower1, flower2)
purple.styles.color = 'purple'

const flower3 = new NameTask('flower 3')
const flower4 = new NameTask('flower 4')
const white = new GroupTask(flower3, flower4)
white.styles.color = 'white'

const flowers = new GroupTask(purple, white)
flowers.styles.bgColor = 'green'

displayTask(new GroupTask(fruits, flowers))
