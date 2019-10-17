import * as yup from 'yup'

const IATI = yup.object().shape({
  type: yup.string().required(),
  code: yup.string().required(),
  vocabulary: yup.string().required(),
  vocabularyUri: yup.string(),
  text: yup.string()
})

const defs = {
  2: yup.array().of(IATI),
}

export default defs
