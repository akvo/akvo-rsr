import * as Yup from 'yup'

export default Yup.object().shape({
  email: Yup.string()
    .email()
    .required()
    .label('E-mail'),
  first_name: Yup.string()
    .required()
    .label('First Name'),
  last_name: Yup.string()
    .required()
    .label('Last Name'),
  password1: Yup.string()
    .min(12)
    .required()
    .matches(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
      'Password does not match the criteria above'
    )
    .label('Password'),
  password2: Yup.string()
    .oneOf([Yup.ref('password1'), null], 'Repeat Password must match')
    .required()
    .label('Repeat Password')
})
