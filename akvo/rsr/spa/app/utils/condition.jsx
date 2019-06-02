import React from 'react'
import { Field } from 'react-final-form'

const Condition = ({ when, is, children, isNot }) => (
  <Field name={when} subscription={{ value: true }}>
    {({ input: { value } }) => ((is !== undefined && value === is) || (isNot !== undefined && value !== isNot) ? children : null)}
  </Field>
)

export default Condition
