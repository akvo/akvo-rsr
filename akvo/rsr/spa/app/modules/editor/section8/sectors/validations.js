import * as yup from 'yup'
import { validationType, transformUndefined } from '../../../../utils/validation-utils'

const RSR = yup.object().shape({
  vocabulary: yup.string(),
  code: yup.string()
})

const DGIS = yup.object().shape({
  vocabulary: yup.string().required(),
  code: yup.string().required(),
  percentage: yup.mixed().required(),
})

const IATI = DGIS.clone().shape({
  vocabularyUri: yup.string(),
  description: yup.string()
})

const EUTF = yup.object().shape({
  vocabulary: yup.string(),
  code: yup.string(),
  percentage: yup.mixed(),
  vocabularyUri: yup.string(),
  description: yup.string()
})

const DFID = EUTF.clone().shape({
  code: yup.string().transform(transformUndefined).when('vocabulary', {
    is: value => value !== null && value !== undefined,
    then: yup.string().required()
  })
})


const output = {}
output[validationType.RSR] = yup.array().of(RSR)
// output[validationType.IATI_BASIC] = yup.array().of(IATI_BASIC).min(1)
output[validationType.IATI] = yup.array().of(IATI).min(1)
output[validationType.DGIS] = yup.array().of(DGIS).min(1)
output[validationType.EUTF] = yup.array().of(EUTF).min(1)
output[validationType.DFID] = yup.array().of(DFID).min(1)
// output[validationType.NLR] = yup.array().of(NLR).min(1)
// output[validationType.Gietrenk] = yup.array().of(Gietrenk).min(1)

export default output
