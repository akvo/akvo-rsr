import * as yup from 'yup'
import { validationType } from '../../../../utils/validation-utils'


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

const EUTF = IATI.clone()

const output = {}
output[validationType.IATI] = yup.array().of(IATI)
output[validationType.DGIS] = yup.array().of(DGIS)
output[validationType.EUTF] = yup.array().of(EUTF)

export default output
