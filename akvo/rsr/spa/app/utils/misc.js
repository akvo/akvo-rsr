export const datePickerConfig = {
  format: 'DD/MM/YYYY',
  placeholder: 'DD/MM/YYYY'
}

export const camelToKebab = string => string.replace(/[\w]([A-Z])/g, m => `${m[0]}-${m[1]}`).toLowerCase()
export const kebabToCamel = (s) => s.replace(/(-\w)/g, m => m[1].toUpperCase())

export const havePropsChanged = (props, nextProps, prevProps) => {
  let hasChanged = false
  for(let i = 0; i < props.length; i += 1){
    if(nextProps[props[i]] !== prevProps[props[i]]){
      hasChanged = true
      break
    }
  }
  return hasChanged
}

export const Aux = node => node.children

export const inputNumberAmountFormatting = {
  formatter: value => value.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  parser: value => value.replace(/(,*)/g, '')
}

export const dateTransform = {
  request: (data) => {
    if(!data) return data
    const transformItem = ($data) => {
      if(typeof $data !== 'object') return $data
      const res = {}
      Object.keys($data).forEach(key => {
        if(Array.isArray($data[key])){
          res[key] = $data[key].map(item => transformItem(item))
        }
        else if(typeof $data[key] === 'string' && (key.indexOf('date') !== -1 || key.indexOf('period') !== -1) && $data[key]){
          const date = $data[key].split('/')
          if(date.length === 3){
            res[key] = `${date[2]}-${date[1]}-${date[0]}`
          } else {
            res[key] = $data[key]
          }
        } else {
          res[key] = $data[key]
        }
      })
      return res
    }
    if(Array.isArray(data)){
      return data.map(it => transformItem(it))
    }
    return transformItem(data)
  },
  response: (data) => {
    if(!data) return data
    const transformItem = ($data) => {
      if(typeof $data !== 'object') return $data
      const res = {}
      Object.keys($data).forEach(key => {
        if(Array.isArray($data[key])){
          res[key] = $data[key].map(item => transformItem(item))
        }
        else if(typeof $data[key] === 'string' && (key.indexOf('date') !== -1 || key.indexOf('period') !== -1) && $data[key]){
          const date = $data[key].split('-')
          if(date.length === 3){
            res[key] = `${date[2]}/${date[1]}/${date[0]}`
          } else {
            res[key] = $data[key]
          }
        } else {
          res[key] = $data[key]
        }
      })
      return res
    }
    if(Array.isArray(data)){
      return data.map(it => transformItem(it))
    }
    return transformItem(data)
  }
}
