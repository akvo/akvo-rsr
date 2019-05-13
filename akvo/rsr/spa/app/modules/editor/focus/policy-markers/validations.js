import * as yup from 'yup'
import { validationType } from '../../../../utils/validation-utils'


const DGIS = yup.object().shape({
  policyMarker: yup.string(),
  significance: yup.string().when('policyMarker', {
    is: value => value !== null && value !== '',
    then: yup.string().required()
  })
})

export const IATI = DGIS.clone().shape({
  description: yup.string(),
  vocabulary: yup.string(),
  vocabularyUri: yup.string()
})

const arrays = {
  IATI: yup.array().of(IATI).min(1),
}

export const getValidationSets = (validationsSetIds, opts = {}) => {
  const validationSets = []
  if(validationsSetIds.indexOf(validationType.IATI) !== -1){
    validationSets.push(opts.arrays ? arrays.IATI : IATI)
  }
  if(validationsSetIds.indexOf(validationType.DGIS) !== -1){
    validationSets.push(opts.arrays ? arrays.DGIS : DGIS)
  }
  return validationSets
}

export default arrays
