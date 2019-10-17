import * as yup from 'yup'
import { validationType } from '../../../../utils/validation-utils'


const DGIS = yup.object().shape({
  policyMarker: yup.string().required(),
  significance: yup.string().required(),
})

const IATI = DGIS.clone().shape({
  description: yup.string(),
  vocabulary: yup.string(),
  vocabularyUri: yup.string()
})

const EUTF = IATI.clone()

const output = {}
output[validationType.IATI] = yup.array().of(IATI)
output[validationType.DGIS] = yup.array().of(DGIS).min(1)
output[validationType.EUTF] = yup.array().of(EUTF)

export default output
