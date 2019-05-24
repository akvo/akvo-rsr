import * as yup from 'yup'

const RSR = yup.object().shape({
  isPublic: yup.boolean().default(true),
  validations: yup.array().of(yup.number()).default([1, 2]),
  title: yup.string().default('').required(),
  subtitle: yup.string().default('').required(),
  iatiActivityId: yup.string(),
  iatiStatus: yup.string().required(),
  plannedStartDate: yup.string().required(),
  plannedEndDate: yup.string().required(),
  actualStartDate: yup.string(),
  actualEndDate: yup.string(),
  currency: yup.string().default('EUR'),
  language: yup.string().default('en'),
  currentImage: yup.string(), // .required(),
  currentImageCaption: yup.string(),
  currentImageCredit: yup.string()
})

const IATI = RSR.clone().shape({
  defaultAidTypeVocabulary: yup.string(),
  defaultAidType: yup.string(),
  defaultFlowType: yup.string(),
  defaultTiedStatus: yup.string(),
  collaborationType: yup.string(),
  defaultFinanceType: yup.string(),
})

const DGIS = RSR.clone().shape({
  actualStartDate: RSR.fields.actualStartDate.required(),
  actualEndDate: RSR.fields.actualEndDate.required(),
  defaultAidTypeVocabulary: yup.string(),
  defaultAidType: yup.string().required(),
  defaultFlowType: yup.string().required(),
  defaultTiedStatus: yup.string().required(),
})

const defs = {
  1: RSR,
  2: IATI,
  3: DGIS
}

export default defs
