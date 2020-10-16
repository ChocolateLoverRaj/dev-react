const EventEmitter = require('eventemitter3')
const { writeFile } = require('fs/promises')
const { createReadStream } = require('fs')
const { Readable } = require('stream')

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
    if (this.buildPromise) {
      const getLatestBuildPromise = (buildPromise) => new Promise((resolve, reject) => {
        buildPromise.then(output => {
          resolve(output)
        })
        this.emitter.once('update', buildPromise => {
          resolve(getLatestBuildPromise(buildPromise))
        })
      })
      return Readable.from([getLatestBuildPromise(this.buildPromise)])
    } else {
      try {
        const stream = createReadStream(this.outputPath)
        this.emitter.once('update', () => {
          stream.destroy(new FileOutput.OutdatedError())
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
