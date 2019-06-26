import * as yup from 'yup'

const RSR = yup.object().shape({
  periodStart: yup.string(),
  periodEnd: yup.string(),
  targetValue: yup.string(),
  targetComment: yup.string()
})

const defs = {
  1: yup.array().of(RSR).min(1)
}

export default defs
