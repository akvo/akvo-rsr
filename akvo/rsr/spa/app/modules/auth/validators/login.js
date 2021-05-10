import * as Yup from 'yup'

export default Yup.object().shape({
  username: Yup.string()
    .email()
    .required()
    .label('E-mail'),
  password: Yup.string()
    .required()
    .label('Password')
})
