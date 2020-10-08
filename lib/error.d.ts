declare class WrapperError extends Error {
    constructor(message: string, error: Error)

    error: Error
}

export default WrapperError
