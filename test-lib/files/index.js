export class File {
  canRead = true
  canWrite = true
}

export class NormalFile extends File {
  constructor (content) {
    super()
    this.content = content
  }
}

export class Dir extends File {
  files = new Map()
}

class EnoentError extends Error {
  code = 'ENOENT'
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
