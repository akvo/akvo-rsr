import * as Yup from 'yup'

export default Yup.object().shape({
  email: Yup.string()
    .email()
    .required()
    .label('E-mail')
})
