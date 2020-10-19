import EventEmitter from 'eventemitter3'
import { writeFile, unlink } from 'fs/promises'
import { createReadStream } from 'fs'
import { Readable, PassThrough } from 'stream'

class OutdatedError extends Error {
  constructor () {
    super('A new update was created while you started streaming the file. Try again to stream the latest file.')
  }
}

class DestroyedError extends Error {
  constructor () {
    super('The FileOutput was destroyed.')
  }
}

class FileOutput {
  constructor (outputPath) {
    console.log(writeFile)

    this.outputPath = outputPath
    this.emitter = new EventEmitter()
  }

  async update (builder) {
    this.emitter.emit('cancel')
    const build = builder(this.emitter)
    this.emitter.emit('update', build)
    this.buildPromise = build
    let output
    try {
      output = await build
    } catch (e) {
      throw new Error(`Builder error: ${e}`)
    }
    if (build !== this.buildPromise) {
      return
    }
    try {
      await writeFile(this.outputPath, output)
    } catch (e) {
      throw new Error(`Error writing file: ${e}`)
    }
    if (build !== this.buildPromise) {
      return
    }
    this.buildPromise = null
  }

  read () {
    const getBuildPromiseStream = buildPromise => {
      const getLatestBuildPromise = (buildPromise) => new Promise((resolve, reject) => {
        buildPromise.then(resolve)
          .catch(e => {
            reject(new Error(`Error with buildPromise: ${e}`))
          })
        this.emitter.once('update', buildPromise => {
          resolve(getLatestBuildPromise(buildPromise))
        })
      })
      return Readable.from([getLatestBuildPromise(buildPromise)])
    }
    if (this.buildPromise) {
      return getBuildPromiseStream(this.buildPromise)
    } else {
      try {
        const stream = new PassThrough({ encoding: 'utf-8' })
        const fileStream = createReadStream(this.outputPath)
        let streamStarted = false
        fileStream.once('error', err => {
          stream.destroy(new Error(`Error with read stream: ${err}`))
        })
        fileStream.once('data', () => {
          streamStarted = true
        })
        fileStream.on('data', data => {
          stream.push(data)
        })
        fileStream.once('end', () => {
          stream.end()
        })
        this.emitter.once('update', buildPromise => {
          fileStream.destroy()
          if (streamStarted) {
            stream.destroy(new OutdatedError())
          } else {
            getBuildPromiseStream(buildPromise)
              .once('error', err => {
                stream.destroy(err)
              })
              .pipe(stream)
          }
        })
        this.emitter.once('destroy', () => {
          fileStream.destroy()
          stream.destroy(new DestroyedError())
        })
        return stream
      } catch (e) {
        throw new Error(`Error creating read stream: ${e}`)
      }
    }
  }

  async destroy () {
    this.emitter.emit('cancel')
    this.emitter.emit('destroy')
    this.buildPromise = null
    try {
      await unlink(this.outputPath)
    } catch (e) {
      if (e.code !== 'ENOENT') {
        throw new Error(`Error unlinking file: ${e}`)
      }
    }
  }
}

FileOutput.OutdatedError = OutdatedError
FileOutput.DestroyedError = DestroyedError

export default FileOutput
