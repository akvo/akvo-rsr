import * as yup from 'yup'

const RSR = yup.object().shape({
  isPublic: yup.boolean().default(true),
  validations: yup.array().of(yup.number()).default([1, 2]),
  title: yup.string().default('').required().min(3),
  subtitle: yup.string().default('').required().min(3),
  iatiStatus: yup.string().required(),
  dateStartPlanned: yup.string().nullable().when('dateStartActual', {
    is: value => value === null || value === '' || value === undefined,
    then: yup.string().nullable().required()
  }),
  dateEndPlanned: yup.string().nullable(),
  dateStartActual: yup.string().nullable(),
  dateEndActual: yup.string().nullable(),
  currency: yup.string().default('EUR'),
  language: yup.string().default('en'),
  currentImage: yup.string().nullable().required(),
  currentImageCaption: yup.string(),
  currentImageCredit: yup.string(),
  defaultAidTypeVocabulary: yup.string()
})

const EUTF = RSR.clone().shape({
  iatiActivityId: yup.string().nullable()
})

const IATI_BASIC = RSR.clone().shape({
  iatiActivityId: yup.string().nullable().required().min(1)
})

const IATI = IATI_BASIC.clone().shape({
  hierarchy: yup.string().nullable(),
  defaultAidType: yup.string(),
  defaultFlowType: yup.string(),
  defaultTiedStatus: yup.string(),
  collaborationType: yup.string(),
  defaultFinanceType: yup.string(),
  language: yup.string().default('en').required()
})

const DGIS = RSR.clone().shape({
  iatiActivityId: yup.string().nullable().required(),
  dateEndPlanned: yup.string().nullable().when('dateEndActual', {
    is: value => value === null || value === '' || value === undefined,
    then: yup.string().nullable().required()
  }),
  defaultAidTypeVocabulary: yup.string(),
  defaultAidType: yup.string().required(),
  defaultFinanceType: yup.string().required(),
  defaultFlowType: yup.string().required(),
  defaultTiedStatus: yup.string().required(),
  language: yup.string().default('en').required()
})

const DFID = IATI.clone()

const defs = {
  1: RSR,
  2: IATI,
  3: DGIS,
  5: EUTF,
  6: DFID,
  8: IATI_BASIC
}

export default defs
