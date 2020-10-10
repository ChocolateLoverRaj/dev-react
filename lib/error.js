class WrapperError extends Error {
  constructor(message, error) {
    const wrappedMessage = `${message}\n\nOriginal: ${error.stack}`
    super(wrappedMessage)
    this.originalError = error
  }
}

export default WrapperError
