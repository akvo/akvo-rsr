import * as yup from 'yup'
import { validationType } from '../../../../utils/validation-utils'

export const RSR = yup.object().shape({
  url: yup.string().required().when('document', {
    is: value => value !== undefined && value !== '',
    then: yup.string().notRequired()
  }),
  title: yup.string().required(),
  document: yup.string()
})

export const DGIS = RSR.clone().shape({
  categories: yup.array().of(yup.object().shape({ category: yup.string() }))
})

export const IATI = DGIS.clone().shape({
  documentFormat: yup.string().required(),
  titleLanguage: yup.string(),
  documentLanguage: yup.string(),
  documentDate: yup.string()
})


const arrays = {
  RSR: yup.array().of(RSR),
  IATI: yup.array().of(IATI),
  DGIS: yup.array().of(DGIS)
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
