import * as yup from 'yup'
import { transformUndefined, validationType } from '../../../../utils/validation-utils'

const IATI = yup.object().shape({
  region: yup.string().required(),
  percentage: yup.mixed().required().transform(transformUndefined),
  description: yup.string(),
  vocabulary: yup.string(),
  vocabularyUri: yup.string()
})

const DGIS = yup.object().shape({
  region: yup.string().required(),
  percentage: yup.mixed().required().transform(transformUndefined),
})

const DFID = IATI.clone()

const output = {}
output[validationType.IATI] = yup.array().of(IATI).min(1)
output[validationType.DGIS] = yup.array().of(DGIS).min(1)
output[validationType.DFID] = yup.array().of(DFID).min(1)

export default output
