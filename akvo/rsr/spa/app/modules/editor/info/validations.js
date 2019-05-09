import * as yup from 'yup'

import { validationType } from '../../../utils/validation-utils'

const basic = yup.object().shape({
  isPublic: yup.boolean().default(true),
  validations: yup.array().of(yup.number()).default([1]),
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

const IATI = basic.clone().shape({
  defaultAidTypeVocabulary: yup.string(),
  defaultAidType: yup.string(),
  defaultFlowType: yup.string(),
  defaultTiedStatus: yup.string(),
  collaborationType: yup.string(),
  defaultFinanceType: yup.string(),
})

const DGIS = basic.clone().shape({
  actualStartDate: basic.fields.actualStartDate.required(),
  actualEndDate: basic.fields.actualEndDate.required(),
  defaultAidTypeVocabulary: yup.string(),
  defaultAidType: yup.string().required(),
  defaultFlowType: yup.string().required(),
  defaultTiedStatus: yup.string().required(),
})

export const getValidationSets = (validationsSetIds) => {
  const validationSets = [basic]
  if(validationsSetIds.indexOf(validationType.IATI) !== -1){
    validationSets.push(IATI)
  }
  if(validationsSetIds.indexOf(validationType.DGIS) !== -1){
    validationSets.push(DGIS)
  }
  return validationSets
}

export default {
  basic,
  IATI,
  DGIS,
}
