import * as yup from 'yup'

const RSR = yup.object().shape({
  title: yup.string().required(),
  indicators: yup.array().of(yup.object().shape({
    title: yup.string(),
    periods: yup.array().of(yup.object().shape({
      periodStart: yup.string().nullable().required(),
      periodEnd: yup.string().nullable().required()
    }))
  }))
})


const defs = {
  1: yup.array().of(RSR).min(1)
}

export default defs
