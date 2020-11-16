import { BaseEncodingOptions } from 'fs'

declare function readCreateDir(path: string, options?: BaseEncodingOptions | BufferEncoding): Promise<Array<string>>

export default readCreateDir
