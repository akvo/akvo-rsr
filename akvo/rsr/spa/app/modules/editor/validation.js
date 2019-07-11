import { isEqual } from 'lodash'
import { getValidationSets } from '../../utils/validation-utils'

const modules = [
  'section1',
  'section1/related-projects',
  'section2/contacts',
  'section3/partners',
  'section4',
  'section6/budget-items',
  'section6/planned-disbursements',
  'section6/transactions',
  'section7/location-items',
  'section7/recipient-countries',
  'section7/recipient-regions',
  'section8/sectors',
  'section8/policy-markers',
  'section8/humanitarian-scopes',
  'section9/links',
  'section9/docs'
]

const validationDefs = modules.reduce((acc, key) => ({
  ...acc,
  [key]: require(`./${key}/validations`).default // eslint-disable-line
}), {})

export const validate = (module, validationSetIds, fields, abortEarly = false) => {
  const validationDef = validationDefs[module]
  if(!validationDef){
    return []
  }
  if(!validationDefs.hasOwnProperty(module)){
    return []
  }
  const validationSets = getValidationSets(validationSetIds, validationDef)
  // let isValid = true
  // console.log(`validate ${module}`, fields)
  let errors = []
  validationSets.forEach((validationSet) => {
    try{
      validationSet.validateSync(fields, { abortEarly })
    } catch(error){
      // console.log(module, 'validation error', error)
      // if(!abortEarly){
        const newErrors = error.inner.map(({ type, path }) => ({ type, path })).filter(it => errors.findIndex(existing => isEqual(it, existing)) === -1)
        errors = [...errors, ...newErrors]
        console.log(module, newErrors)
        console.log(error.inner)
      // }
      // isValid = false
    }
  })
  // console.log('validated', module, isValid)
  return errors
}
