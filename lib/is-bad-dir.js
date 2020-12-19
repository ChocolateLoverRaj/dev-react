// Check for unrecognized special dirs
const isBadDir = dir => dir.startsWith('_') && !['_index', '_res'].includes(dir)

export default isBadDir
