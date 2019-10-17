import * as yup from 'yup'
import { validationType } from '../../../utils/validation-utils'

const RSR = yup.object().shape({
  donateURL: yup.string()
})

const IATI_BASIC = RSR.clone()

export const IATI = RSR.clone().shape({
  capitalSpendPercentage: yup.mixed(),
  countryBudgetItems: yup.array(),
  transactions: yup.array(),
  plannedDisbursements: yup.array(),
  countryBudgetVocabulary: yup.string()
})

const DGIS = RSR.clone().shape({
  transactions: yup.array(),
  plannedDisbursements: yup.array()
})

const EUTF = RSR.clone().shape({
  transactions: yup.array().min(1),
})

const DFID = IATI.clone()

const NLR = RSR.clone()

const Gietrenk = RSR.clone().shape({
  capitalSpendPercentage: yup.mixed().required(),
  transactions: yup.array(),
})

const output = {}
output[validationType.RSR] = RSR
output[validationType.IATI_BASIC] = IATI_BASIC
output[validationType.IATI] = IATI
output[validationType.DGIS] = DGIS
output[validationType.EUTF] = EUTF
output[validationType.DFID] = DFID
output[validationType.NLR] = NLR
output[validationType.Gietrenk] = Gietrenk

export default output
