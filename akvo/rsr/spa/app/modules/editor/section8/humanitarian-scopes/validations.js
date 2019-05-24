import * as yup from 'yup'

const IATI = yup.object().shape({
  type: yup.string(),
  code: yup.string().when('type', {
    is: value => value !== undefined && value !== '',
    then: yup.string().required()
  }),
  vocabulary: yup.string().when('type', {
    is: value => value !== undefined && value !== '',
    then: yup.string().required()
  }),
  vocabularyUri: yup.string(),
  text: yup.string()
})

const defs = {
  2: yup.array().of(IATI),
}

export default defs
