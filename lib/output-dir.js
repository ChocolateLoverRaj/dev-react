// Set up the outputDir
import ConcatTask from './tasks/tasks/concat.js'
import CustomTask from './tasks/tasks/custom.js'
import TextAddon from './tasks/addons/text.js'
import StateAddon from './tasks/extra/state-addon.js'
import AutoStateAddon from './tasks/extra/auto-state-addon.js'
import readDir from './read-create-dir.js'
import fsExtra from 'fs-extra'
import { mkdir } from 'fs/promises'
import { join } from 'path'

class OutputDir {
  constructor (path) {
    this.path = path
    const readAddon = new StateAddon(new TextAddon('   Read output dir'))
    const deleteAddon = new StateAddon(new TextAddon('   Delete unnecessary files'))
    const headAddon = new AutoStateAddon(
      new TextAddon('Prepare output dir'),
      readAddon,
      deleteAddon
    )
    this.task = new ConcatTask(
      new CustomTask(headAddon),
      new CustomTask(readAddon),
      new CustomTask(deleteAddon)
    )

    // Before the readDir operation gets complete, ensureFiles can be set in advance
    this.ensureFiles = new Set()
    // Map of files and promises deleting the files
    this.deleteFiles = new Map()
    // Read the dir
    this.read = readDir(path, { withFileTypes: true }).then(files => {
      // Delete files that aren't ensured
      for (const file of files) {
        if (file.isDirectory() && this.ensureFiles.has(file.name)) {
          // remove from ensureFiles so that we know which ones were already ensured
          this.ensureFiles.delete(file.name)
        }
        // Add delete promise
        this.deleteFiles.set(file.name, fsExtra.remove(join(path, file.name)))
      }
      // Create directories if they were part of ensureFiles and didn't already exist
      // If it already existed, it would've been removed from the set
      // Save old ensureFiles as local var
      const ensureFiles = this.ensureFiles
      // Update this.ensureFiles to be a Map
      this.ensureFiles = new Map()
      // Create directories
      for (const name of ensureFiles) {
        this.ensureFiles.set(name, mkdir(join(path, name)))
      }

      // Update the readAddon
      readAddon.state = 'complete'
      readAddon.update()

      // Update the deleteAddon
      Promise.all(this.deleteFiles.values()).then(() => {
        deleteAddon.state = 'complete'
        deleteAddon.update()
      })
    })
  }

  async createDir (name) {
    // If this.ensureFiles is a Set, that means the readDir operation hasn't been completed yet
    if (this.ensureFiles instanceof Set && this.ensureFiles.add(name)) {
      // this.read will create promises ensuring files
      await this.read
      // this.ensureFiles is a Map now
      await this.ensureFiles.get(name)
      return
    }
    // this.read might delete the file
    await this.read
    // If there is a delete promise, wait for it to be completed
    await this.deleteFiles.get(name)
    // Create the file
    await mkdir(join(this.path, name))
  }

  empty () {

  }
}

export default OutputDir
