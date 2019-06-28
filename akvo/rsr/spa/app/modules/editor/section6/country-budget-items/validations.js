import * as yup from 'yup'

const IATI = yup.object().shape({
  code: yup.string().required(),
  percentage: yup.mixed().nullable(),
  description: yup.string(),
})

const defs = {
  2: yup.array().of(IATI)
}

export default defs
