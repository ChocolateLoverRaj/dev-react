// Set up the outputDir
import {
  ConcatTask,
  CustomTask,
  HideTask,
  TextAddon,
  StateAddon,
  AutoStateAddon
} from 'display-task'
import readDir from './read-create-dir.js'
import fsExtra from 'fs-extra'
import { mkdir, rmdir } from 'fs/promises'
import { join } from 'path'

class OutputDir {
  constructor (path) {
    this.path = path
    this.readAddon = new StateAddon(new TextAddon('   Read output dir'))
    this.deleteAddon = new StateAddon(new TextAddon('   Delete unnecessary files'))
    const headAddon = new AutoStateAddon(
      new TextAddon('Prepare output dir'),
      this.readAddon,
      this.deleteAddon
    )
    this.task = new HideTask(new ConcatTask(
      new CustomTask(headAddon),
      new CustomTask(this.readAddon),
      new CustomTask(this.deleteAddon)
    ))

    // Before the readDir operation gets complete, ensureFiles can be set in advance
    this.ensureFiles = new Set()
    // Map of files and promises deleting the files
    this.deleteFiles = new Map()
  }

  empty () {
    // Read the dir and delete files
    this.read = readDir(this.path, { withFileTypes: true }).then(files => {
      // Delete files that aren't ensured
      for (const file of files) {
        if (file.isDirectory() && this.ensureFiles.has(file.name)) {
          // remove from ensureFiles so that we know which ones were already ensured
          this.ensureFiles.delete(file.name)
          continue
        }
        // Add delete promise
        this.deleteFiles.set(file.name, fsExtra.remove(join(this.path, file.name)))
      }
      // Create directories if they were part of ensureFiles and didn't already exist
      // If it already existed, it would've been removed from the set
      // Save old ensureFiles as local var
      const ensureFiles = this.ensureFiles
      // Update this.ensureFiles to be a Map
      this.ensureFiles = new Map()
      // Create directories
      for (const name of ensureFiles) {
        this.ensureFiles.set(name, mkdir(join(this.path, name)))
      }

      // Update the readAddon
      this.readAddon.state = 'complete'
      this.readAddon.update()

      // Update the deleteAddon
      this.deletePromise = Promise.all(this.deleteFiles.values()).then(() => {
        this.deleteAddon.state = 'complete'
        this.deleteAddon.update()
      })
    })
  }

  async createDir (name) {
    // If this.ensureFiles is a Set, that means the readDir operation hasn't been completed yet
    if (this.ensureFiles instanceof Set) {
      // Don't delete the file
      this.ensureFiles.add(name)
      // this.read will create promises ensuring files
      await this.read
      // this.ensureFiles is a Map now
      await this.ensureFiles.get(name)
      return
    }
    // If there is a delete promise, wait for it to be completed
    await this.deleteFiles.get(name)
    // Create the file
    const create = mkdir(join(this.path, name))
    // Set the promise in the ensureFiles map
    this.ensureFiles.set(name, create)
    // Wait for it to be created
    await create
    // Delete the delete promise, because it exists now
    this.deleteFiles.delete(name)
  }

  async removeDir (name) {
    // If the dir hasn't been read, then make sure ensureFiles doesn't have name
    if (this.ensureFiles instanceof Set) {
      this.ensureFiles.delete(name)
      // Make sure the file actually gets deleted
      await this.read
      // Wait for the delete promise, if it exists
      await this.deleteFiles.get(name)
      return
    }
    // Check if it being deleted
    const alreadyPromise = this.deleteFiles.get(name)
    if (alreadyPromise) {
      await alreadyPromise
      return
    }
    // Delete the file
    const deletePromise = rmdir(join(this.path, name))
    // Set the deletePromise in the map
    this.deleteFiles.set(name, deletePromise)
    // Wait for the deletePromise
    await deletePromise
  }

  async destroy () {
    // Wait for this.deletePromise
    await this.read
    await this.deletePromise
    // Hide task (destroyed)
    this.task.hidden = true
    this.task.update()
  }
}

export default OutputDir
