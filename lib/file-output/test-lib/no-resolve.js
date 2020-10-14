// TODO: add tests to this file

const noResolve = (promise, timeout) => new Promise((resolve, reject) => {
  promise.then(() => {
    reject(new Error('Given promise was resolved.'))
  })
  timeout.then(() => {
    resolve()
  })
})

module.exports = noResolve
