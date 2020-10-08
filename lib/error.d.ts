declare class WrapperError extends Error {
    constructor(message: string, error: Error)

    originalError: Error
}

export default WrapperError
