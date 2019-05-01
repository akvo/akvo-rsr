import * as yup from 'yup'

export const validationType = {
  basic: 1,
  IATI: 2,
  DGIS: 3
}

const basic = yup.object().shape({
  title: yup.string().required(),
  subtitle: yup.string().required(),
  iatiActivityId: yup.string(),
  iatiStatus: yup.string().required(),
  plannedStartDate: yup.string().required(),
  plannedEndDate: yup.string().required(),
  actualStartDate: yup.string(),
  actualEndDate: yup.string(),
  currency: yup.string(),
  language: yup.string(),
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
  actualStartDate: yup.date().required(),
  actualEndDate: yup.date().required(),
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
