import * as yup from 'yup'
import { validationType } from '../../../../utils/validation-utils'

export const basic = yup.object().shape({
  city: yup.string().required(),
  address1: yup.string(),
  postalCode: yup.string(),
  address2: yup.string(),
  coordinates: yup.object().shape({
    lat: yup.number().required(),
    lng: yup.number().required()
  })
})

export const administrative = yup.object().shape({
  code: yup.string(),
  vocabulary: yup.string(),
  lavel: yup.mixed()
})

export const IATI = basic.clone().shape({
  name: yup.string(),
  reference: yup.string(),
  code: yup.string(),
  locationDescription: yup.string(),
  activityDescription: yup.string(),
  locationPrecision: yup.string(),
  reach: yup.string(),
  class: yup.string(),
  featureDesignation: yup.string(),
  administratives: yup.array().of(administrative).default([])
})

const arrays = {
  basic: yup.array().of(basic).min(1, 'At least one location is required'),
  IATI: yup.array().of(IATI).min(1, 'At least one location is required'),
  // DGIS: yup.array().of(basic).min(1, 'At least one location is required')
}

export const getValidationSets = (validationsSetIds, opts = {}) => {
  const validationSets = [opts.arrays ? arrays.basic : basic]
  if(validationsSetIds.indexOf(validationType.IATI) !== -1){
    validationSets.push(opts.arrays ? arrays.IATI : IATI)
  }
  return validationSets
}

export default arrays
