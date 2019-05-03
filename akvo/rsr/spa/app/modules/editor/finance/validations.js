import * as yup from 'yup'

const basic = yup.object().shape({
  donateUrl: yup.string()
})

const IATI = basic.clone().shape({
  capitalSpendPercentage: yup.mixed(),
  countryBudgetVocabulary: yup.mixed()
})
