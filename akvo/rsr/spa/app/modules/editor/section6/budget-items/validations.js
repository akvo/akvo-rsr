import * as yup from 'yup'

const RSR = yup.object().shape({
  label: yup.string(),
  type: yup.mixed().required(),
  amount: yup.mixed().required(),
})

const IATI = RSR.clone().shape({
  currency: yup.string().default('EUR'),
  status: yup.mixed(),
  budgetType: yup.mixed(),
  periodStart: yup.string().required(),
  periodEnd: yup.string().required(),
  valueDate: yup.string().required()
})

const IATI_BASIC = RSR.clone().shape({
  periodStart: yup.string().required(),
  periodEnd: yup.string().required(),
  valueDate: yup.string().required()
})

const defs = {
  1: yup.array().of(RSR).min(1),
  2: yup.array().of(IATI).min(1),
  8: yup.array().of(IATI_BASIC).min(1),
}

export default defs
