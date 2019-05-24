import * as yup from 'yup'

const RSR = yup.object().shape({
  vocabulary: yup.string(),
  code: yup.string()
})

const DGIS = yup.object().shape({
  vocabulary: yup.string().required(),
  code: yup.string().required(),
  percentage: yup.mixed().required(),
})

const IATI = DGIS.clone().shape({
  vocabularyUri: yup.string(),
  description: yup.string()
})

const defs = {
  1: yup.array().of(RSR),
  2: yup.array().of(IATI).min(1),
  3: yup.array().of(DGIS).min(1)
}

export default defs
