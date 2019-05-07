import * as yup from 'yup'
import { validationType } from '../../../../utils/misc'

export const DGIS = yup.object().shape({
  value: yup.mixed(),
  valueDate: yup.mixed(),
  periodStart: yup.string(),
  periodEnd: yup.string(),
  providerOrganisation: yup.string(),
  providerOrganisationActivityId: yup.string(),
  recipientOrganisation: yup.string(),
  recipientOrganisationActivityId: yup.string()
})

export const IATI = DGIS.clone().shape({
  currency: yup.string().default('EUR'),
  type: yup.string()
})


const arrays = {
  DGIS: yup.array().of(DGIS),
  IATI: yup.array().of(IATI),
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
