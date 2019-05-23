import * as yup from 'yup'

export const RSR = yup.object().shape({
  summary: yup.string().required(),
  goals: yup.string().required(),
  background: yup.string(),
  baseline: yup.string(),
  targetGroup: yup.string(),
  projectPlan: yup.string(),
  sustainability: yup.string()
})

export const getValidationSets = () => {
  return [RSR]
}
