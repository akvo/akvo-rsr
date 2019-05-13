import * as yup from 'yup'
import { validationType } from '../../../../utils/validation-utils'

export const RSR = yup.object().shape({
  vocabulary: yup.string(),
  code: yup.string()
})

const DGIS = yup.object().shape({
  vocabulary: yup.string().required(),
  code: yup.string().required(),
  percentage: yup.mixed().required(),
})

export const IATI = DGIS.clone().shape({
  vocabularyUri: yup.string(),
  description: yup.string()
})

const arrays = {
  RSR: yup.array().of(RSR),
  IATI: yup.array().of(IATI).min(1),
  DGIS: yup.array().of(DGIS).min(1)
}

export const getValidationSets = (validationsSetIds, opts = {}) => {
  const validationSets = [opts.arrays ? arrays.RSR : RSR]
  if(validationsSetIds.indexOf(validationType.IATI) !== -1){
    validationSets.push(opts.arrays ? arrays.IATI : IATI)
  }
  if(validationsSetIds.indexOf(validationType.DGIS) !== -1){
    validationSets.push(opts.arrays ? arrays.DGIS : DGIS)
  }
  return validationSets
}

export default arrays
