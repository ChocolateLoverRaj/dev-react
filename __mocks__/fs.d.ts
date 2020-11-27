import { Readable, PassThrough } from 'stream'

export { constants } from 'fs'

export declare const _readStreamErrorFiles: Set<string>
export declare function _reset(): void

export declare function createReadStream(path: string): PassThrough | Readable
