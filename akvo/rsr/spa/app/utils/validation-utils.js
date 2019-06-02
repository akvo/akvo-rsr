
export const validationType = {
  RSR: 1,
  IATI: 2,
  DGIS: 3,
  NLR: 4,
  EUTF: 5,
  DFID: 6,
  Gietrenk: 7,
  IATI_BASIC: 8
}

export const getValidations = (validationIds) => {
  const validations = {}
  validations.isIATI = validationIds.indexOf(validationType.IATI) !== -1
  validations.isDGIS = validationIds.indexOf(validationType.DGIS) !== -1
  return validations
}

export const getValidationSets = (ids, defs) => ids.filter(id => defs[id] !== undefined).map(id => defs[id])

export const isFieldOptional = validationSets => (field) => {
  let ret = true
  for(let i = 0; i < validationSets.length; i += 1){
    const fields = validationSets[i].hasOwnProperty('fields') ? validationSets[i].fields : validationSets[i]._subType.fields
    if(fields.hasOwnProperty(field) && fields[field]._exclusive.required){
      ret = false
      break
    }
  }
  return ret
}

export const doesFieldExist = validationSets => (field) => {
  let ret = false
  for(let i = 0; i < validationSets.length; i += 1){
    const fields = validationSets[i].hasOwnProperty('fields') ? validationSets[i].fields : validationSets[i]._subType.fields
    if(fields.hasOwnProperty(field)){
      ret = true
      break
    }
  }
  return ret
}

export const isFieldValid = validationSets => (field, value) => {
  let ret = true
  for(let i = 0; i < validationSets.length; i += 1){
    const fields = validationSets[i].hasOwnProperty('fields') ? validationSets[i].fields : validationSets[i]._subType.fields
    if(fields.hasOwnProperty(field) && !fields[field].isValidSync(value)){
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
