import * as yup from 'yup'
import { validationType } from '../../../utils/validation-utils'

const RSR = yup.object().shape({
  locations: yup.array(),
  recipientCountries: yup.array()
})

export const IATI = RSR.clone().shape({
  projectScope: yup.string(),
  recipientRegions: yup.array()
})

const DGIS = RSR.clone().shape({
  recipientRegions: yup.array()
})

const EUTF = RSR.clone()

const DFID = IATI.clone()

const NLR = RSR.clone().shape({
  projectScope: yup.string()
})

const Gietrenk = RSR.clone()

const output = {}
output[validationType.RSR] = RSR
// output[validationType.IATI_BASIC] = IATI_BASIC
output[validationType.IATI] = IATI
output[validationType.DGIS] = DGIS
output[validationType.EUTF] = EUTF
output[validationType.DFID] = DFID
output[validationType.NLR] = NLR
output[validationType.Gietrenk] = Gietrenk

export default output
