import * as yup from 'yup'
import { validationType } from '../../../../utils/validation-utils'

const IATI = yup.object().shape({
  year: yup.mixed().required(),
})

const output = {}
output[validationType.IATI] = yup.array().of(IATI)
output[validationType.DGIS] = yup.array().of(IATI)

export default output
