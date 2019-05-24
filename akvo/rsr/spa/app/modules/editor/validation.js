import { getValidationSets } from '../../utils/validation-utils'

const modules = [
  'section1',
  'section2/contacts',
  'section3/partners',
  'section4',
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

const validationDefs = modules.reduce((acc, key) => ({
  ...acc,
  [key]: require(`./${key}/validations`).default // eslint-disable-line
}), {})

export const validate = (module, validationSetIds, fields) => {
  const validationDef = validationDefs[module]
  if(!validationDef){
    return true
  }
  if(!validationDefs.hasOwnProperty(module)){
    return true
  }
  const validationSets = getValidationSets(validationSetIds, validationDef)
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
