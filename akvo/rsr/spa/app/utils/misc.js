export const datePickerConfig = {
  format: 'DD/MM/YYYY',
  placeholder: 'DD/MM/YYYY'
}

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

export const Aux = node => node.children

export const inputNumberAmountFormatting = {
  formatter: value => value.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  parser: value => value.replace(/(,*)/g, '')
}
