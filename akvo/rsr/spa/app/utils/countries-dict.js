import list from './countries.json'

const dict = {}
list.forEach(item => {
  dict[item.code.toLowerCase()] = item.name
})

export default dict
