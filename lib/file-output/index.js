const EventEmitter = require('eventemitter3')
const { writeFile } = require('fs/promises')

class FileOutput extends EventEmitter {
  constructor (outputPath) {
    super()
    this.outputPath = outputPath
  }

  async update (builder) {
    this.buildPromise = builder(this)
    const build = this.buildPromise
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
}

module.exports = FileOutput
