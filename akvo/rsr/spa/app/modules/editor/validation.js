import { isEqual } from 'lodash'
import { getValidationSets } from '../../utils/validation-utils'
import { kebabToCamel } from '../../utils/misc'

const modules = [
  'section1',
  'section1/related-projects',
  'section2/contacts',
  'section3/partners',
  'section4',
  'section5/results',
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
  'section9/docs',
  'section11',
  'section11/flags',
  'section11/forecasts'
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
  let errors = []
  const setName = module.indexOf('/') !== -1 ? kebabToCamel(module.substr(module.indexOf('/') + 1)) : ''
  validationSets.forEach((validationSet) => {
    try{
      validationSet.validateSync(fields, { abortEarly })
    } catch(error){
      const newErrors = (error.inner && error.inner.length > 0 ? error.inner : [error]).map(({ type, path, message }) => ({ type, message, path: path ? `${setName}${path}` : setName }))
        .filter((it) => errors.findIndex(existing => isEqual(it, existing)) === -1)
      errors = [...errors, ...newErrors]
    }
  })
  return errors
}
