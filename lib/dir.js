// Recursively do path.dirname()
import { dirname } from 'path'

const dirDotDot = (dirs, path) => {
  for (let i = 0; i < dirs; i++) {
    path = dirname(path)
  }
  return path
}

export default dirDotDot
