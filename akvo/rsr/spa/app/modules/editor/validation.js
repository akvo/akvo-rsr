const modules = [
  'section1',
  'section2',
  'section3',
  'section6/budget-items',
  'section6/planned-disbursements',
  'section7/location-items',
  'section7/recipient-countries',
  'section7/recipient-regions',
  'section8/sectors',
  'section8/policy-markers',
  'section8/humanitarian-scopes',
  'section9/docs'
]

const validationSetGetters = modules.reduce((acc, key) => ({
  ...acc,
  [key]: require(`./${key}/validations`).getValidationSets // eslint-disable-line
}), {})

export const validate = (module, validationSetIds, fields) => {
  const validationSetGetter = validationSetGetters[module]
  if(!validationSetGetter){
    return true
  }
  if(!validationSetGetters.hasOwnProperty(module)){
    return true
  }
  const validationSets = validationSetGetters[module](validationSetIds, { arrays: true })
  let isValid = true
  console.log('validate', fields)
  validationSets.forEach((validationSet) => {
    try{
      validationSet.validateSync(fields)
    } catch(error){
      console.log(module, 'validation error', error)
      isValid = false
    }
  })
  console.log('validated', module, isValid)
  return isValid
}
