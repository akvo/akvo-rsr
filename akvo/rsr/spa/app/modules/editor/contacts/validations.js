import * as yup from 'yup'
import { validationType, transformUndefined } from '../../../utils/validation-utils'

export const basic = yup.object().shape({
  name: yup.string().default(''),
  type: yup.number(),
  organisation: yup.string().default(''),
  department: yup.string().default(''),
  email: yup.string().min(1).email().transform(transformUndefined),
  address: yup.string().min(5).transform(transformUndefined),
  jobTitle: yup.string().default(''),
  phone: yup.string().default(''),
  website: yup.string().url().default('')
})

const DGIS = basic.clone().shape({
  email: basic.fields.email.required(),
  address: basic.fields.address.required()
})

const arrays = {
  basic: yup.array().of(basic),
  IATI: yup.array().of(basic),
  DGIS: yup.array().of(DGIS).min(1, 'At least one contact is required for your validation set')
}

export const getValidationSets = (validationsSetIds, opts = {}) => {
  const validationSets = [opts.arrays ? arrays.basic : basic]
  if(validationsSetIds.indexOf(validationType.DGIS) !== -1){
    validationSets.push(opts.arrays ? arrays.DGIS : DGIS)
  }
  return validationSets
}

export default arrays
