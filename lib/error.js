class WrapperError extends Error {
  constructor (message, error) {
    super(message)
    this.error = error
  }
}

export default WrapperError
