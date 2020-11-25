import EventEmitter from 'eventemitter3'

declare class Stats {
  constructor(file: string)

  file: string

  isDirectory(): boolean
}

interface Dirent {
  name: string

  isDirectory(): boolean
}

export declare const _frozen: Set<string>
export declare const _errorFiles: Set<string>
export declare function reset(): void
export declare const _mock: EventEmitter<{ unfreeze(filename: string): void }>

export declare function access(filename: string, permissions: number): Promise<void>
export declare function stat(filename: string): Promise<Stats>
export declare function writeFile(filename: string, content: string): Promise<void>
export declare function unlink(filename: string): Promise<void>
export declare function readdir(path: string, options?: { withFileTypes: false }): Promise<string>
export declare function readdir(path: string, options: { withFileTypes: true }): Promise<Dirent>
export declare function mkdir(path: string): Promise<void>
