import * as yup from 'yup'
import { validationType } from '../../../../utils/validation-utils'

const RSR = yup.object().shape({
  address1: yup.string(),
  address2: yup.string(),
  postcode: yup.string(),
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
  locationCode: yup.string(),
  locationDescription: yup.string(),
  activityDescription: yup.string(),
  locationPrecision: yup.string(),
  locationReach: yup.string(),
  locationClass: yup.string(),
  featureDesignation: yup.string(),
  administratives: yup.array().of(yup.object().shape({
    code: yup.string(),
    vocabulary: yup.string(),
    lavel: yup.mixed()
  })).default([])
})

const DGIS = RSR.clone()

const EUTF = RSR.clone().shape({
  locationCode: yup.string(),
  activityDescription: yup.string(),
  administratives: yup.array().of(yup.object().shape({
    code: yup.string(),
    vocabulary: yup.string(),
    lavel: yup.mixed()
  })).default([])
})

const DFID = EUTF.clone().shape({
  activityDescription: yup.string(),
  locationPrecision: yup.string(),
  locationReach: yup.string(),
  locationClass: yup.string(),
  featureDesignation: yup.string(),
})

const NLR = RSR.clone().shape({
  locationCode: yup.string(),
})

const Gietrenk = DFID.clone()

const output = {}
output[validationType.RSR] = yup.array().of(RSR).min(1)
// output[validationType.IATI_BASIC] = yup.array().of(IATI_BASIC).min(1)
output[validationType.IATI] = yup.array().of(IATI).min(1)
output[validationType.DGIS] = yup.array().of(DGIS).min(1)
output[validationType.EUTF] = yup.array().of(EUTF).min(1)
output[validationType.DFID] = yup.array().of(DFID).min(1)
output[validationType.NLR] = yup.array().of(NLR).min(1)
output[validationType.Gietrenk] = yup.array().of(Gietrenk).min(1)

export default output
