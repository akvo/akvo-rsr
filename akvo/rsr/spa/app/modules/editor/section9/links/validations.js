import * as yup from 'yup'
import { validationType } from '../../../../utils/validation-utils'

const RSR = yup.object().shape({
  url: yup.string().url(),
  caption: yup.string()
})

const output = {}
output[validationType.RSR] = yup.array().of(RSR)

export default output
