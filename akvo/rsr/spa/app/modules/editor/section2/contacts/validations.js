import * as yup from 'yup'
import { transformUndefined } from '../../../../utils/validation-utils'

const RSR = yup.object().shape({
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

const DGIS = RSR.clone().shape({
  email: RSR.fields.email.required(),
  address: RSR.fields.address.required()
})

const defs = {
  1: yup.array().of(RSR),
  2: yup.array().of(RSR),
  3: yup.array().of(DGIS).min(1)
}

export default defs
