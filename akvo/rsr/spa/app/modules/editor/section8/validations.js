import * as yup from 'yup'
import { validationType } from '../../../utils/validation-utils'

const RSR = yup.object().shape({
  sectors: yup.array()
})

export const IATI = RSR.clone().shape({
  humanitarian: yup.string().nullable(),
  policyMarkers: yup.array(),
  humanitarianScopes: yup.array()
})

const DGIS = RSR.clone().shape({
  policyMarkers: yup.array(),
})

const EUTF = DGIS.clone()


const output = {}
output[validationType.RSR] = RSR
// output[validationType.IATI_BASIC] = IATI_BASIC
output[validationType.IATI] = IATI
output[validationType.DGIS] = DGIS
output[validationType.EUTF] = EUTF
// output[validationType.DFID] = DFID
// output[validationType.NLR] = NLR
// output[validationType.Gietrenk] = Gietrenk
output[validationType.DGIS_MOD] = DGIS

export default output
