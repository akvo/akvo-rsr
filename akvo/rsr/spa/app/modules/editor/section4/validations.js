import * as yup from 'yup'

export const RSR = yup.object().shape({
  summary: yup.string().min(5).required(),
  goals: yup.string().min(5).required(),
  background: yup.string(),
  baseline: yup.string(),
  targetGroup: yup.string(),
  projectPlan: yup.string(),
  sustainability: yup.string()
})

const defs = {
  1: RSR
}
export default defs
