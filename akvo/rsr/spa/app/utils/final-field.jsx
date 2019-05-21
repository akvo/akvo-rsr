import React from 'react'
import { Input, Select, DatePicker } from 'antd'
import { Field } from 'react-final-form'
import { datePickerConfig } from './misc'

const CONTROLS = {
  input: ({ input, meta }) => {
    // console.log(input, meta)
    return <Input {...input} />
  },
  textarea: ({ input }) => <Input.TextArea {...input} />,
  select: ({options, input}) => {
    return (
      <Select {...input}>
        {options.map(({ label, value }) => <Select.Option key={value} value={value}>{label}</Select.Option>)}
      </Select>
    )
  },
  datepicker: ({ input }) => <DatePicker {...{...input, ...datePickerConfig}} />
}

class FinalField extends React.Component{
  render(){
    const component = this.props.control ? CONTROLS[this.props.control] : this.props.render
    return (
      <Field
        name={this.props.name}
        component={component}
        {...this.props}
      />
    )
  }
}

export default FinalField
