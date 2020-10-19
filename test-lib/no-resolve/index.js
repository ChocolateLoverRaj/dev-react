const noResolve = (promise, timeout) => new Promise((resolve, reject) => {
  promise.then(() => {
    reject(new Error('Given promise was resolved.'))
  })
  timeout.then(() => {
    resolve()
  })
})

export default noResolve
