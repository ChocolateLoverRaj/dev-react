const EventEmitter = require('eventemitter3')
const { writeFile } = require('fs/promises')
const { createReadStream } = require('fs')
const { Readable, PassThrough } = require('stream')

class OutdatedError extends Error {
  constructor () {
    super('A new update was created while you started streaming the file. Try again to stream the latest file.')
  }
}

class FileOutput {
  constructor (outputPath) {
    this.outputPath = outputPath
    this.emitter = new EventEmitter()
  }

  async update (builder) {
    const build = builder(this)
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
            getBuildPromiseStream(buildPromise).pipe(stream)
          }
        })
        return stream
      } catch (e) {
        throw new Error(`Error creating read stream: ${e}`)
      }
    }
  }
}

FileOutput.OutdatedError = OutdatedError

module.exports = FileOutput
