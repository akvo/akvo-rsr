import * as yup from 'yup'
import { validationType } from '../../../../utils/validation-utils'

const DGIS = yup.object().shape({
  value: yup.mixed().default(null),
  valueDate: yup.string().nullable().when('value', {
    is: value => value !== null && value !== '',
    then: yup.string().required()
  }),
  periodStart: yup.string().nullable().when('value', {
    is: value => value !== null && value !== '',
    then: yup.string().required()
  }),
  periodEnd: yup.string().nullable().when('value', {
    is: value => value !== null && value !== '',
    then: yup.string().required()
  }),
  providerOrganisation: yup.string(),
  providerOrganisationActivityId: yup.string(),
  recipientOrganisation: yup.string(),
  recipientOrganisationActivityId: yup.string()
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
