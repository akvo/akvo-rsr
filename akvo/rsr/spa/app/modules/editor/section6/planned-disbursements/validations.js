import * as yup from 'yup'

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


const defs = {
  3: yup.array().of(DGIS),
  2: yup.array().of(IATI),
}

export default defs
