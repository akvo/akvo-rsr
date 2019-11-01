import * as yup from 'yup'
import { validationType } from '../../../../utils/validation-utils'

const DGIS = yup.object().shape({
  value: yup.mixed().default(null).nullable().required(),
  valueDate: yup.string().nullable().required(),
  periodStart: yup.string().nullable().required(),
  periodEnd: yup.string().nullable().required(),
  providerOrganisation: yup.string().nullable(),
  providerOrganisationActivity: yup.string(),
  receiverOrganisation: yup.string().nullable(),
  receiverOrganisationActivity: yup.string()
})

const IATI = DGIS.clone().shape({
  currency: yup.string().default('EUR'),
  type: yup.string()
})

const DFID = IATI.clone()


const output = {}
output[validationType.IATI] = yup.array().of(IATI)
output[validationType.DGIS] = yup.array().of(DGIS)
output[validationType.DFID] = yup.array().of(DFID)

export default output
