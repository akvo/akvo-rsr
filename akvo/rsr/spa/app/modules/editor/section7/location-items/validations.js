import * as yup from 'yup'

const RSR = yup.object().shape({
  address1: yup.string(),
  address2: yup.string(),
  postalCode: yup.string(),
  location: yup.object().shape({
    text: yup.string().required(),
    coordinates: yup.object().shape({
      lat: yup.number().required(),
      lng: yup.number().required()
    })
  })
})

const IATI = RSR.clone().shape({
  name: yup.string(),
  reference: yup.string(),
  code: yup.string(),
  locationDescription: yup.string(),
  activityDescription: yup.string(),
  locationPrecision: yup.string(),
  reach: yup.string(),
  class: yup.string(),
  featureDesignation: yup.string(),
  administratives: yup.array().of(yup.object().shape({
    code: yup.string(),
    vocabulary: yup.string(),
    lavel: yup.mixed()
  })).default([])
})

const defs = {
  1: yup.array().of(RSR).min(1),
  2: yup.array().of(IATI).min(1),
}
export default defs
