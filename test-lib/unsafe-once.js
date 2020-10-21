// It's like events.once, except it is unsafe because it doesn't throw on error events
const unsafeOnce = (emitter, event) => new Promise(resolve => {
  emitter.once(event, (...args) => {
    resolve([...args])
  })
})

export default unsafeOnce
