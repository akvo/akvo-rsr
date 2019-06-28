import * as yup from 'yup'

export const RSR = yup.object().shape({
  projectPlanSummary: yup.string().min(5).required(),
  goalsOverview: yup.string().min(5).required(),
  background: yup.string(),
  currentStatus: yup.string(),
  targetGroup: yup.string(),
  projectPlan: yup.string(),
  sustainability: yup.string()
})

const defs = {
  1: RSR
}
export default defs
