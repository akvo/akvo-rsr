import * as yup from 'yup'

const RSR = yup.object().shape({
  name: yup.string().required().default(''),
  role: yup.number().required().default(1),
  secondaryReporter: yup.boolean(),
  iatiActivityId: yup.string(),
  fundingAmount: yup.mixed().when('role', {
    is: 1,
    then: yup.mixed().required()
  })
})

const defs = {
  1: yup.array().of(RSR).min(1)
}

export default defs
