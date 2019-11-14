import * as yup from 'yup'
import { validationType } from '../../../utils/validation-utils'

const IATI = yup.object().shape({
  fss: yup.array().of(yup.object().shape({
    extractionDate: yup.string().nullable().required()
  }))
})

const output = {}
output[validationType.IATI] = IATI
output[validationType.DGIS] = IATI

export default output
