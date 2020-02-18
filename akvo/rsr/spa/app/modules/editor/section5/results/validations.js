import * as yup from 'yup'
import { validationType } from '../../../../utils/validation-utils'

const validNumberError = 'A valid number is required.'

const transform = (value, originalValue) => originalValue ? (String(originalValue).trim() === '' ? null : value) : null

const RSR = yup.object().shape({
  title: yup.string().nullable().required(),
  indicators: yup.array().of(yup.object().shape({
    title: yup.string().nullable().required(),
    measure: yup.string().required(),
    periods: yup.array().of(yup.object().shape({
      periodStart: yup.string().nullable().required(),
      periodEnd: yup.string().nullable().required(),
      targetValue: yup
        .number()
        .integer(validNumberError)
        .typeError(validNumberError)
        .nullable()
        .transform(transform),
      disaggregationTargets: yup.array().of(yup.object().shape({
        value: yup
          .number()
          .integer(validNumberError)
          .typeError(validNumberError)
          .nullable()
          .transform(transform)
      }))
    }))
  }))
})


const DGIS = yup.object().shape({
  title: yup.string().nullable().required(),
  indicators: yup.array().of(yup.object().shape({
    title: yup.string().nullable().required(),
    measure: yup.string().required(),
    type: yup.number(),
    baselineYear: yup.string().nullable().required(),
    baselineValue: yup.string().nullable().required(),
    periods: yup.array().when('type', (value) => {
      const targetValue = yup
        .number()
        .integer(validNumberError)
        .typeError(validNumberError)
        .nullable()
        .transform(transform)
      const disaggregationTargets = yup.array().of(yup.object().shape({
          value: yup
            .number()
            .integer(validNumberError)
            .typeError(validNumberError)
            .nullable()
            .transform(transform)
        }))
      return yup.array().of(yup.object().shape({
        periodStart: yup.string().nullable().required(),
        periodEnd: yup.string().nullable().required(),
        targetValue: value === 1 ? targetValue.required() : targetValue,
        disaggregationTargets
      }))
    })
  })).min(1)
})


const defs = {}
defs[validationType.RSR] = yup.array().of(RSR)
defs[validationType.DGIS] = yup.array().of(DGIS).min(1)

export default defs
