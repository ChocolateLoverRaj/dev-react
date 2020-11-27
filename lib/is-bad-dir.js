// Check for unrecognized special dirs
const isBadDir = dir => dir.startsWith('_') && !['_index', '_common'].includes(dir)

export default isBadDir
