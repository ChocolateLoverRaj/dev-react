// Returns a promise that gets resolved after process.nextTick()
// TODO: test this

const tick = () => new Promise((resolve, reject) => {
  process.nextTick(resolve)
})

module.exports = tick
