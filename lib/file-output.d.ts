import EventEmitter from 'eventemitter3'
import { ReadStream } from 'fs'
import { Readable } from 'stream'

declare namespace FileOutput {
  declare class OutdatedError extends Error {
    constructor()
  }

  declare class DestroyedError extends Error {
    constructor()
  }
}

interface Events {
  update(): void
  cancel(): void
}

declare class FileOutput {
  constructor(outputPath: string)

  outputPath: string
  emitter: EventEmitter<Events>
  buildPromise?: Promise<string>

  update(builder: (emitter: EventEmitter<Events>) => Promise<string>): Promise<void>
  read(): Readable | ReadStream
  destroy(): Promise<void>
}

export default FileOutput
