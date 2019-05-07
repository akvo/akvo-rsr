import * as yup from 'yup'
import { validationType } from '../../../../utils/misc'

export const sector = yup.object().shape({
  name: yup.string(),
  vocabulary: yup.string(),
  uri: yup.string(),
  description: yup.string()
})

export const DGIS = yup.object().shape({
  type: yup.string(),
  value: yup.mixed(),
  date: yup.string(),
  valueDate: yup.string(),
  providerOrganisation: yup.string(),
  recipientOrganisation: yup.string(),
  providerOrganisationActivityId: yup.string(),
  receiverOrganisationActivityId: yup.string(),
  description: yup.string(),
  aidTypeVocabulary: yup.string()
})

export const IATI = DGIS.clone().shape({
  currency: yup.string().default('EUR'),
  humanitarian: yup.boolean(),
  reference: yup.string(),
  aidType: yup.string(),
  disbursementChannel: yup.string(),
  financeType: yup.string(),
  flowType: yup.string(),
  tiedStatus: yup.string(),
  recipientCountry: yup.string(),
  recipientRegion: yup.string(),
  recipientRegionVocabulary: yup.string(),
  recipientRegionVocabularyUrl: yup.string(),
  sectors: yup.array().of(sector).default([])
})

const arrays = {
  IATI: yup.array().of(IATI),
  DGIS: yup.array().of(DGIS)
}

export const getValidationSets = (validationsSetIds, opts = {}) => {
  const validationSets = []
  if(validationsSetIds.indexOf(validationType.IATI) !== -1){
    validationSets.push(opts.arrays ? arrays.IATI : IATI)
  }
  if(validationsSetIds.indexOf(validationType.DGIS) !== -1){
    validationSets.push(opts.arrays ? arrays.DGIS : DGIS)
  }
  return validationSets
}

export default arrays
