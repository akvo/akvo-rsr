import * as yup from 'yup'

const RSR = yup.object().shape({
  organisation: yup.string().required().default(''),
  iatiOrganisationRole: yup.number().required().default(1),
  isSecondaryReporter: yup.boolean().nullable(),
  iatiActivityId: yup.string().nullable(),
  fundingAmount: yup.mixed().when('iatiOrganisationRole', {
    is: 1,
    then: yup.mixed().required()
  })
})

const defs = {
  1: yup.array().of(RSR).min(1)
}

export default defs
