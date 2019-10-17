import * as yup from 'yup'

const RSR = yup.object().shape({
  periodStart: yup.string(),
  periodEnd: yup.string(),
  targetValue: yup.string(),
  targetComment: yup.string()
})

const IATI = RSR.clone().shape({
  periodStart: yup.string().required(),
  periodEnd: yup.string().required(),
})

const DGIS = IATI.clone().shape({
  targetValue: yup.string().required()
})

const defs = {
  1: yup.array().of(RSR).min(1),
  2: yup.array().of(IATI).min(1),
  3: yup.array().of(DGIS).min(1)
}

export default defs
