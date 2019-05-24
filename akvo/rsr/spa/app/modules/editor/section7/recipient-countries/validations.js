import * as yup from 'yup'
import { transformUndefined } from '../../../../utils/validation-utils'

const basic = yup.object().shape({
  country: yup.string().required()
})

const IATI = basic.clone().shape({
  percentage: yup.mixed().required().transform(transformUndefined),
  description: yup.string()
})

const DGIS = basic.clone().shape({
  percentage: yup.mixed().required().transform(transformUndefined),
})

const defs = {
  1: yup.array().of(basic).min(1),
  2: yup.array().of(IATI).min(1),
  3: yup.array().of(DGIS).min(1)
}


export default defs
