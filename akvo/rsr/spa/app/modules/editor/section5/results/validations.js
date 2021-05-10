import * as yup from 'yup'
import { validationType } from '../../../../utils/validation-utils'

const validNumberError = 'A valid number is required.'

const transform = (value, originalValue) => originalValue ? (String(originalValue).trim() === '' ? null : value) : null
const transformDecimal = (v, o) => v ? v : (String(o).trim() === '' ? null : parseFloat(String(o).replace(/,/g, '.').trim()))

const RSR = yup.object().shape({
  title: yup.string().nullable().required(),
  indicators: yup.array().of(yup.object().shape({
    title: yup.string().nullable().required(),
    measure: yup.string(),
    references: yup.array().of(yup.object().shape({
      vocabulary: yup.string().required(),
      vocabularyUri: yup.string(),
      reference: yup.string().required()
    })),
    disaggregationTargets: yup.array().of(yup.object().shape({
      value: yup
        .number()
        .integer(validNumberError)
        .typeError(validNumberError)
        .nullable()
        .transform(transform)
    })),
    periods: yup.array().when('type', (value) => {
      const targetValue = value === 1 ? yup
        .number()
        .integer(validNumberError)
        .typeError(validNumberError)
        .nullable()
        .transform(transform)
        : yup.mixed().nullable().transform(transform)
      return yup.array().of(yup.object().shape({
        periodStart: yup.string().nullable().required(),
        periodEnd: yup.string().nullable().required(),
        targetValue,
        disaggregationTargets: yup.array().of(yup.object().shape({
          value: yup
            .number()
            .integer(validNumberError)
            .typeError(validNumberError)
            .nullable()
            .transform(transform)
        }))
      }))
    })
  }))
})


const DGIS = yup.object().shape({
  title: yup.string().nullable().required(),
  indicators: yup.array().of(yup.object().shape({
    title: yup.string().nullable().required(),
    measure: yup.string(),
    type: yup.number(),
    baselineYear: yup.string().nullable().required(),
    baselineValue: yup.string().nullable().when('type', (value) => {
      if(value === 1) return yup.string().nullable().required()
      return yup.string().nullable()
    }),
    disaggregationTargets: yup.array().of(yup.object().shape({
      value: yup
        .number()
        .integer(validNumberError)
        .typeError(validNumberError)
        .nullable()
        .transform(transform)
    })),
    periods: yup.array().when('type', (value) => {
      const targetValue = value === 1 ? yup
        .number()
        .integer(validNumberError)
        .typeError(validNumberError)
        .nullable()
        .transform(transform)
        .required()
        : yup.mixed().nullable().transform(transform)
      return yup.array().of(yup.object().shape({
        periodStart: yup.string().nullable().required(),
        periodEnd: yup.string().nullable().required(),
        targetValue,
        disaggregationTargets: yup.array().of(yup.object().shape({
          value: yup
            .number()
            .integer(validNumberError)
            .typeError(validNumberError)
            .nullable()
            .transform(transform)
        }))
      }))
    })
  })).min(1)
})

const DGIS_MOD = yup.object().shape({
  title: yup.string().nullable().required(),
  indicators: yup.array().of(yup.object().shape({
    title: yup.string().nullable().required(),
    measure: yup.string(),
    type: yup.number(),
    baselineYear: yup.string().nullable().required(),
    baselineValue: yup.string().nullable().when('type', (value) => {
      if(value === 1) return yup.string().nullable().required()
      return yup.string().nullable()
    }),
    disaggregationTargets: yup.array().of(yup.object().shape({
      value: yup
        .number()
        .typeError(validNumberError)
        .nullable()
        .transform(transformDecimal)
    })),
    targetValue: yup.number().when('type', (value) => {
      return value === 1 ? yup
        .number()
        .typeError(validNumberError)
        .nullable()
        .transform(transformDecimal)
        .required()
        : yup.mixed().nullable().transform(transform)
    }),
    periods: yup.array().of(yup.object().shape({
      periodStart: yup.string().nullable().required(),
      periodEnd: yup.string().nullable().required(),
      disaggregationTargets: yup.array().of(yup.object().shape({
        value: yup
          .number()
          .integer(validNumberError)
          .typeError(validNumberError)
          .nullable()
          .transform(transform)
      }))
    }))
  })).min(1)
})


const defs = {}
defs[validationType.RSR] = yup.array().of(RSR)
defs[validationType.DGIS] = yup.array().of(DGIS).min(1)
defs[validationType.DGIS_MOD] = yup.array().of(DGIS_MOD).min(1)

export default defs
