// Returns a promise that gets resolved after process.nextTick()

const tick = () => new Promise(resolve => {
  process.nextTick(resolve)
})

export default tick
