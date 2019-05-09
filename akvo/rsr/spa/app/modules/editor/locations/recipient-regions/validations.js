import * as yup from 'yup'
import { validationType, transformUndefined } from '../../../../utils/validation-utils'


export const IATI = yup.object().shape({
  region: yup.string().required(),
  percentage: yup.mixed().required().transform(transformUndefined),
  description: yup.string(),
  vocabulary: yup.string(),
  vocabularyUri: yup.string()
})

export const DGIS = yup.object().shape({
  region: yup.string().required(),
  percentage: yup.mixed().required().transform(transformUndefined),
})

const arrays = {
  IATI: yup.array().of(IATI).min(1, 'At least one region is required'),
  DGIS: yup.array().of(DGIS).min(1, 'At least one region is required')
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
