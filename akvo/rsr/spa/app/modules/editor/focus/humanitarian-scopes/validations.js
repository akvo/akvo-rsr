import * as yup from 'yup'
import { validationType } from '../../../../utils/validation-utils'


export const IATI = yup.object().shape({
  type: yup.string(),
  code: yup.string().when('type', {
    is: value => value !== null && value !== '',
    then: yup.string().required()
  }),
  vocabulary: yup.string().when('type', {
    is: value => value !== null && value !== '',
    then: yup.string().required()
  }),
  vocabularyUri: yup.string(),
  text: yup.string()
})

const arrays = {
  IATI: yup.array().of(IATI),
}

export const getValidationSets = (validationsSetIds, opts = {}) => {
  const validationSets = []
  if(validationsSetIds.indexOf(validationType.IATI) !== -1){
    validationSets.push(opts.arrays ? arrays.IATI : IATI)
  }
  return validationSets
}

export default arrays
