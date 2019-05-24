import * as yup from 'yup'
import { transformUndefined } from '../../../../utils/validation-utils'

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

const defs = {
  2: yup.array().of(IATI).min(1),
  3: yup.array().of(DGIS).min(1)
}

export default defs
