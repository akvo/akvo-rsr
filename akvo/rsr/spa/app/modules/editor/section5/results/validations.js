import * as yup from 'yup'

const validNumberError = 'A valid number is required.'

const RSR = yup.object().shape({
  title: yup.string().required(),
  indicators: yup.array().of(yup.object().shape({
    title: yup.string(),
    periods: yup.array().of(yup.object().shape({
      periodStart: yup.string().nullable().required(),
      periodEnd: yup.string().nullable().required(),
      targetValue: yup
        .number()
        .integer(validNumberError)
        .typeError(validNumberError)
        .nullable()
        .transform((value, originalValue) => originalValue.trim() === '' ? null : value),
      disaggregationTargets: yup.array().of(yup.object().shape({
        value: yup
          .number()
          .integer(validNumberError)
          .typeError(validNumberError)
          .nullable()
          .transform((value, originalValue) => originalValue.trim() === '' ? null : value)
      }))
    }))
  }))
})


const defs = {
  1: yup.array().of(RSR).min(1)
}

export default defs
