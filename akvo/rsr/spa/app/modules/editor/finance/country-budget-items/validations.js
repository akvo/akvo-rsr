import * as yup from 'yup'
import { validationType } from '../../../../utils/misc'

export const IATI = yup.object().shape({
  code: yup.string(),
  percentage: yup.mixed(),
  description: yup.string(),
})


const arrays = {
  IATI: yup.array().of(IATI),
}

export const getValidationSets = (validationsSetIds, opts = {}) => {
  const validationSets = [opts.arrays ? arrays.IATI : IATI]
  return validationSets
}

export default arrays
