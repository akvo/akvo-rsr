import * as yup from 'yup'

export const RSR = yup.object().shape({
  notes: yup.string(),
  keywords: yup.array().of(yup.string())
})

const defs = {
  1: RSR
}
export default defs
