export class File {
  constructor () {
    this.canRead = true
    this.canWrite = true
  }
}

export class NormalFile extends File {
  constructor (content) {
    super()
    this.content = content
  }
}

export class Dir extends File {
  constructor () {
    super()
    this.files = new Map()
  }
}

class EnoentError extends Error {
  constructor () {
    super(...arguments)
    this.code = 'ENOENT'
  }
}

export const topDir = new Dir()

export const reset = () => {
  topDir.files.clear()
}

export const getFile = path => {
  let file = topDir
  const filenames = path.split('/')
  let fileTree = []
  for (const filename of filenames) {
    fileTree.push(filename)
    if (file.files.has(filename)) {
      file = file.files.get(filename)
    } else {
      throw new EnoentError(`File: ${fileTree.join('/')} does not exist`)
    }
  }
  return file
}

export const setFile = (path, fileToSet) => {
  let dir = topDir
  const filenames = path.split('/')
  let fileTree = []
  for (const filename of filenames) {
    fileTree.push(filename)
    if (fileTree.length === filenames.length) {
      dir.files.set(filename, fileToSet)
      return
    }
    if (dir.files.has(filename)) {
      dir = dir.files.get(filename)
    } else {
      throw new EnoentError(`File: ${fileTree.join('/')} does not exist`)
    }
  }
}

export const unlinkFile = path => {
  let file = topDir
  const filenames = path.split('/')
  let fileTree = []
  for (const filename of filenames) {
    fileTree.push(filename)
    if (file.files.has(filename)) {
      if (fileTree.length === filenames.length) {
        file.files.delete(filename)
        return
      }
      file = file.files.get(filename)
    } else {
      throw new EnoentError(`File: ${fileTree.join('/')} does not exist`)
    }
  }
}
