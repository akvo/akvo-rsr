import * as yup from 'yup'
import { validationType, transformUndefined } from '../../../../utils/validation-utils'

const RSR = yup.object().shape({
  vocabulary: yup.string(),
  sectorCode: yup.string()
})

const DGIS = yup.object().shape({
  vocabulary: yup.string().required(),
  sectorCode: yup.string().required(),
  percentage: yup.mixed().required(),
})

const IATI = DGIS.clone().shape({
  vocabularyUri: yup.string(),
  text: yup.string()
})

const NLR = yup.object().shape({
  vocabulary: yup.string(),
  sectorCode: yup.string(),
  percentage: yup.mixed().nullable(),
  text: yup.string()
})

const EUTF = NLR.clone().shape({
  vocabularyUri: yup.string()
})

const DFID = EUTF.clone().shape({
  vocabulary: yup.string().required(),
  sectorCode: yup.string().required()
})


const output = {}
output[validationType.RSR] = yup.array().of(RSR)
output[validationType.IATI] = yup.array().of(IATI).min(1)
output[validationType.DGIS] = yup.array().of(DGIS).min(1)
output[validationType.EUTF] = yup.array().of(EUTF)
output[validationType.DFID] = yup.array().of(DFID)
output[validationType.NLR] = yup.array().of(NLR)

export default output
