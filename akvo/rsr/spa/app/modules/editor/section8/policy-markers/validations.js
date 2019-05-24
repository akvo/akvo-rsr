import * as yup from 'yup'

const DGIS = yup.object().shape({
  policyMarker: yup.string(),
  significance: yup.string().when('policyMarker', {
    is: value => value !== null && value !== '',
    then: yup.string().required()
  })
})

const IATI = DGIS.clone().shape({
  description: yup.string(),
  vocabulary: yup.string(),
  vocabularyUri: yup.string()
})

const defs = {
  2: yup.array().of(IATI),
  3: yup.array().of(DGIS),
}

export default defs
