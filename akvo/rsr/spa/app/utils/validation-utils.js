
export const validationType = {
  basic: 1,
  IATI: 2,
  DGIS: 3
}

export const isFieldOptional = validationSets => (field) => {
  let ret = true
  for(let i = 0; i < validationSets.length; i += 1){
    if(validationSets[i].fields.hasOwnProperty(field) && validationSets[i].fields[field]._exclusive.required){
      ret = false
      break
    }
  }
  return ret
}

export const doesFieldExist = validationSets => (field) => {
  let ret = false
  for(let i = 0; i < validationSets.length; i += 1){
    if(validationSets[i].fields.hasOwnProperty(field)){
      ret = true
      break
    }
  }
  return ret
}

export const isFieldValid = validationSets => (field, value) => {
  let ret = true
  for(let i = 0; i < validationSets.length; i += 1){
    if(validationSets[i].fields.hasOwnProperty(field) && !validationSets[i].fields[field].isValidSync(value)){
      ret = false
      break
    }
  }
  return ret
}

export const yupModel = (yupset) => {
  const ret = {}
  Object.keys(yupset.fields).forEach((key) => {
    ret[key] = yupset.fields[key].default()
  })
  return ret
}

export const transformUndefined = value => value === '' ? undefined : value
