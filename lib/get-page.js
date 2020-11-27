// Get page of folder
// _index -> /
// index  -> /index
// a b    -> /a/b
const getPage = path => path === '_index'
  ? '/'
  : `/${path.split(' ').join('/')}`

export default getPage
