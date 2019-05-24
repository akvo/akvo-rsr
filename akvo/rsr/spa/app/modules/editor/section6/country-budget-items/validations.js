import * as yup from 'yup'

const IATI = yup.object().shape({
  code: yup.string(),
  percentage: yup.mixed(),
  description: yup.string(),
})

const defs = {
  2: yup.array().of(IATI)
}

export default defs
