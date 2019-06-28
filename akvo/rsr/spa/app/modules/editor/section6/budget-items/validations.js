import * as yup from 'yup'
import { validationType } from '../../../../utils/validation-utils'

const RSR = yup.object().shape({
  otherExtra: yup.string().nullable(),
  label: yup.mixed().required(),
  amount: yup.mixed().required(),
})

const IATI_BASIC = RSR.clone().shape({
  periodStart: yup.string().required(),
  periodEnd: yup.string().required(),
  valueDate: yup.string().required()
})

const IATI = IATI_BASIC.clone().shape({
  currency: yup.string().default('EUR'),
  status: yup.mixed(),
  budgetType: yup.string()
})

const DGIS = IATI_BASIC.clone().shape({
  budgetType: yup.string()
})
const EUTF = RSR.clone()

const DFID = IATI.clone().shape({
  valueDate: yup.string().notRequired()
})

const NLR = RSR.clone().shape({
  currency: yup.string().default('EUR'),
  budgetType: yup.string()
})

const Gietrenk = NLR.clone().shape({
  periodStart: yup.string(),
  periodEnd: yup.string(),
  valueDate: yup.string()
})


const output = {}
output[validationType.RSR] = yup.array().of(RSR).min(1)
output[validationType.IATI_BASIC] = yup.array().of(IATI_BASIC).min(1)
output[validationType.IATI] = yup.array().of(IATI).min(1)
output[validationType.DGIS] = yup.array().of(DGIS).min(1)
output[validationType.EUTF] = yup.array().of(EUTF).min(1)
output[validationType.DFID] = yup.array().of(DFID).min(1)
output[validationType.NLR] = yup.array().of(NLR).min(1)
output[validationType.Gietrenk] = yup.array().of(Gietrenk).min(1)

export default output
