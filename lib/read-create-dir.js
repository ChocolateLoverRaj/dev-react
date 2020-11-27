// Reads a dir like fsPromises.readdir, but creates the folder if it doesn't exist.
import { readdir, mkdir } from 'fs/promises'

const readCreateDir = async (path, options) => {
  try {
    return await readdir(path, options)
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e
    }
    await mkdir(path)
    return []
  }
}

export default readCreateDir
