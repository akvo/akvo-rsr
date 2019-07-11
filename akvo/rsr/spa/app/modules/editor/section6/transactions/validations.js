import * as yup from 'yup'
import { validationType } from '../../../../utils/validation-utils'

const sector = yup.object().shape({
  code: yup.string(),
  vocabulary: yup.string(),
  vocabularyUri: yup.string(),
  text: yup.string()
})

const base = yup.object().shape({
  value: yup.mixed(),
  transactionType: yup.string().nullable().when('value', {
    is: value => value !== null && value !== '',
    then: yup.string().required()
  }),
  transactionDate: yup.string().nullable().when('value', {
    is: value => value !== null && value !== '',
    then: yup.string().required()
  }),
  valueDate: yup.string().nullable().when('value', {
    is: value => value !== null && value !== '',
    then: yup.string().required()
  }),
  providerOrganisation: yup.string().nullable(),
  receiverOrganisation: yup.string().nullable(),
  providerOrganisationActivity: yup.string(),
  receiverOrganisationActivity: yup.string(),
  description: yup.string()
})

const DGIS = base.clone().shape({
  aidTypeVocabulary: yup.string()
})

const IATI = DGIS.clone().shape({
  currency: yup.string().default('EUR'),
  humanitarian: yup.boolean().nullable(),
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
  sectors: yup.array().of(sector).default([]),
  aidTypeVocabulary: yup.string()
})

const EUTF = yup.object().shape({
  currency: yup.string().default('EUR'),
  transactionType: yup.string().nullable().when('value', {
    is: value => value !== null && value !== '',
    then: yup.string().required()
  }),
  providerOrganisation: yup.string().nullable(),
  providerOrganisationActivityId: yup.string(),
  aidTypeVocabulary: yup.string()
})

const DFID = DGIS.clone().shape({
  currency: yup.string().default('EUR'),
  reference: yup.string()
})

const Gietrenk = base.clone().shape({
  currency: yup.string().default('EUR'),
  reference: yup.string()
})


const output = {}
// output[validationType.RSR] = yup.array.of(RSR)
// output[validationType.IATI_BASIC] = yup.array.of(IATI_BASIC)
output[validationType.IATI] = yup.array().of(IATI)
output[validationType.DGIS] = yup.array().of(DGIS)
output[validationType.EUTF] = yup.array().of(EUTF)
output[validationType.DFID] = yup.array().of(DFID)
// output[validationType.NLR] = yup.array().of(NLR)
output[validationType.Gietrenk] = yup.array().of(Gietrenk)

export default output
