import * as yup from 'yup'
import { transformUndefined, validationType } from '../../../../utils/validation-utils'

const RSR = yup.object().shape({
  country: yup.string().required()
})

const IATI = RSR.clone().shape({
  percentage: yup.mixed().required().transform(transformUndefined),
  description: yup.string()
})

const DGIS = RSR.clone().shape({
  percentage: yup.mixed().required().transform(transformUndefined),
})

const EUTF = yup.object().shape({
  country: yup.string(),
  percentage: yup.mixed(),
  description: yup.string()
})

const DFID = EUTF.clone()

const NLR = RSR.clone()

const Gietrenk = RSR.clone()

const output = {}
output[validationType.RSR] = yup.array().of(RSR)
// output[validationType.IATI_BASIC] = yup.array().of(IATI_BASIC).min(1)
output[validationType.IATI] = yup.array().of(IATI).min(1)
output[validationType.DGIS] = yup.array().of(DGIS).min(1)
output[validationType.EUTF] = yup.array().of(EUTF)
output[validationType.DFID] = yup.array().of(DFID)
output[validationType.NLR] = yup.array().of(NLR)
output[validationType.Gietrenk] = yup.array().of(Gietrenk)

export default output
