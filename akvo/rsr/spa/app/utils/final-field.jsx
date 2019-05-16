import React from 'react'
import { Input, Select, DatePicker } from 'antd'
import { Field } from 'react-final-form'
import { datePickerConfig } from './misc'

const CONTROLS = {
  input: ({ input, meta }) => {
    // console.log(input, meta)
    return <Input {...input} />
  },
  textarea: props => <Input.TextArea {...props} />,
  select: ({options, ...props}) => {
    console.log(options)
    return (
      <Select {...props}>
        {options.map(({ label, value }) => <Select.Option value={value}>{label}</Select.Option>)}
      </Select>
    )
  },
  datepicker: props => <DatePicker {...{...props, ...datePickerConfig}} />
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
