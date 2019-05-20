import * as yup from 'yup'
import { validationType, transformUndefined } from '../../../../utils/validation-utils'

export const basic = yup.object().shape({
  country: yup.string().required()
})

export const IATI = basic.clone().shape({
  percentage: yup.mixed().required().transform(transformUndefined),
  description: yup.string()
})

export const DGIS = basic.clone().shape({
  percentage: yup.mixed().required().transform(transformUndefined),
})

const arrays = {
  basic: yup.array().of(basic).min(1, 'At least one country is required'),
  IATI: yup.array().of(IATI).min(1, 'At least one country is required'),
  DGIS: yup.array().of(DGIS).min(1, 'At least one country is required')
}

export const getValidationSets = (validationsSetIds, opts = {}) => {
  const validationSets = [opts.arrays ? arrays.basic : basic]
  if(validationsSetIds.indexOf(validationType.IATI) !== -1){
    validationSets.push(opts.arrays ? arrays.IATI : IATI)
  }
  if(validationsSetIds.indexOf(validationType.DGIS) !== -1){
    validationSets.push(opts.arrays ? arrays.DGIS : DGIS)
  }
  return validationSets
}

export default arrays
