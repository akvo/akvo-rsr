import * as yup from 'yup'

const sector = yup.object().shape({
  name: yup.string(),
  vocabulary: yup.string(),
  uri: yup.string(),
  description: yup.string()
})

const DGIS = yup.object().shape({
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

const IATI = DGIS.clone().shape({
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

const defs = {
  2: yup.array().of(IATI),
  3: yup.array().of(DGIS)
}

export default defs
