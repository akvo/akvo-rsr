import * as yup from 'yup'
import { transformUndefined } from '../../../../utils/validation-utils'

const RSR = yup.object().shape({
  url: yup.string().transform(transformUndefined).required().when('document', {
    is: value => value !== undefined && value !== '',
    then: yup.string().notRequired()
  }),
  title: yup.string().transform(transformUndefined).required(),
  document: yup.string()
})

const DGIS = RSR.clone().shape({
  categories: yup.array().of(yup.object().shape({ category: yup.string() }))
})

const IATI = DGIS.clone().shape({
  documentFormat: yup.string().required(),
  titleLanguage: yup.string(),
  documentLanguage: yup.string(),
  documentDate: yup.string()
})


const defs = {
  RSR: yup.array().of(RSR),
  IATI: yup.array().of(IATI),
  DGIS: yup.array().of(DGIS)
}

export default defs
