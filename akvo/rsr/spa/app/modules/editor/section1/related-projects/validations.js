import * as yup from 'yup'

const RSR = yup.object().shape({
  relation: yup.mixed().required(),
  relatedProject: yup.mixed().required()
})

const defs = {
  1: yup.array().of(RSR)
}

export default defs
