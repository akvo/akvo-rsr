/* globals FileReader */
import { diff } from 'deep-object-diff'

export const datePickerConfig = {
  format: 'DD/MM/YYYY',
  placeholder: 'DD/MM/YYYY'
}
export const nicenum = num => String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
export const camelToKebab = string => string.replace(/[\w]([A-Z])/g, m => `${m[0]}-${m[1]}`).toLowerCase()
export const kebabToCamel = (s) => s.replace(/(-\w)/g, m => m[1].toUpperCase())
export const snakeToCamel = (s) => s.replace(/(_\w)/g, m => m[1].toUpperCase())
export const camelToSnake = string => string.replace(/[\w]([A-Z])/g, m => `${m[0]}_${m[1]}`).toLowerCase()

export const havePropsChanged = (props, nextProps, prevProps) => {
  let hasChanged = false
  for (let i = 0; i < props.length; i += 1) {
    if (nextProps[props[i]] !== prevProps[props[i]]) {
      hasChanged = true
      break
    }
  }
  return hasChanged
}

export const Aux = node => node.children

export const inputNumberAmountFormatting = {
  formatter: value => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  parser: value => String(value).replace(/(,*)/g, '')
}

export const dateTransform = {
  request: (data) => {
    if (!data) return data
    const transformItem = ($data) => {
      if (typeof $data !== 'object') return $data
      const res = {}
      Object.keys($data).forEach(key => {
        if (Array.isArray($data[key])) {
          res[key] = $data[key].map(item => transformItem(item))
        }
        else if (typeof $data[key] === 'string' && (key.indexOf('date') !== -1 || key.indexOf('period') !== -1) && $data[key]) {
          const date = $data[key].split('/')
          if (date.length === 3) {
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
    if (Array.isArray(data)) {
      return data.map(it => transformItem(it))
    }
    return transformItem(data)
  },
  response: (data) => {
    if (!data) return data
    const transformItem = ($data) => {
      if (typeof $data !== 'object') return $data
      const res = {}
      Object.keys($data).forEach(key => {
        if (Array.isArray($data[key])) {
          res[key] = $data[key].map(item => transformItem(item))
        }
        else if (typeof $data[key] === 'string' && (key.indexOf('date') !== -1 || key.indexOf('period') !== -1) && $data[key]) {
          if (/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test($data[key])) {
            const date = $data[key].split('-')
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
    if (Array.isArray(data)) {
      return data.map(it => transformItem(it))
    }
    return transformItem(data)
  }
}

export const arrayMove = (arr, from, to) => {
  const ret = arr.slice(0, arr.length)
  ret[from] = arr[to]
  ret[to] = arr[from]
  return ret
}

export const check4deleted = (obj) => {
  let found = false
  if (obj == null) return false
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object') {
      if (check4deleted(obj[key])) {
        found = true
      }
    }
    else if (obj[key] === undefined && String(Number(key)) !== 'NaN') {
      found = true
    }
  })
  return found
}

export const shouldUpdateSectionRoot = (prevProps, nextProps) => {
  const difference = diff(prevProps.fields, nextProps.fields)
  // update if item removed
  const keys = Object.keys(difference)
  if (keys.length > 0 && Object.keys(difference[keys[0]]).length === 1 && difference[keys[0]][Object.keys(difference[keys[0]])[0]] === undefined) return false
  // update if some props diff
  const strDiff = JSON.stringify(difference)
  const shouldUpdate = strDiff.indexOf('"id"') !== -1 || strDiff.indexOf('"removing"') !== -1 || check4deleted(difference)
  return !shouldUpdate
}

export const filteroutFns = (props) => {
  const ret = {}
  Object.keys(props).forEach(prop => {
    if (typeof props[prop] !== 'function') {
      ret[prop] = props[prop]
    }
  })
  return ret
}

export const getBase64 = (img, callback) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export const getUniqueValues = (arr, keyProps) => {
  const kvArray = arr.map(entry => {
    const key = keyProps.map(k => entry[k]).join('|')
    return [key, entry]
  })
  const map = new Map(kvArray)
  return Array.from(map.values())
}
