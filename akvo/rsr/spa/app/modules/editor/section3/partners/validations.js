import * as yup from 'yup'

const RSR = yup.object().shape({
  organisation: yup.string().required().default(''),
  iatiOrganisationRole: yup.number().required().default(1),
  isSecondaryReporter: yup.boolean().nullable(),
  fundingAmount: yup.mixed().when('iatiOrganisationRole', {
    is: 1,
    then: yup.mixed().required()
  })
})

const IATI = RSR.clone().shape({
  iatiActivityId: yup.string().nullable(),
})

const defs = {
  1: yup.array().of(RSR).min(1),
  2: yup.array().of(IATI).min(1),
  3: yup.array().of(IATI).min(1),
  6: yup.array().of(IATI).min(1),
  8: yup.array().of(IATI).min(1)
}

export default defs
