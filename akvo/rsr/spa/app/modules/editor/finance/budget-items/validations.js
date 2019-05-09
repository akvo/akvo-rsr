import * as yup from 'yup'
import { validationType } from '../../../../utils/validation-utils'

export const basic = yup.object().shape({
  label: yup.string(),
  type: yup.mixed().required(),
  amount: yup.mixed().required(),
})

export const IATI = basic.clone().shape({
  currency: yup.string().default('EUR'),
  status: yup.mixed(),
  budgetType: yup.mixed(),
  periodStart: yup.string().required(),
  periodEnd: yup.string().required(),
  valueDate: yup.string().required()
})

const arrays = {
  basic: yup.array().of(basic).min(1, 'At least one budget item is required for your validation set'),
  IATI: yup.array().of(IATI).min(1, 'At least one budget item is required for your validation set'),
}

export const getValidationSets = (validationsSetIds, opts = {}) => {
  const validationSets = [opts.arrays ? arrays.basic : basic]
  if(validationsSetIds.indexOf(validationType.IATI) !== -1){
    validationSets.push(opts.arrays ? arrays.IATI : IATI)
  }
  return validationSets
}

export default arrays
