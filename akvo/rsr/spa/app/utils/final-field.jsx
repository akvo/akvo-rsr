import React from 'react'
import { Input, InputNumber, Select, DatePicker } from 'antd'
import { Field } from 'react-final-form'
import moment from 'moment'
import { datePickerConfig } from './misc'

const inputNumberAmountFormatting = (currencySymbol) => {
  const step = 1000
  if(currencySymbol !== undefined){
    const currencyRegExp = new RegExp(`\\${currencySymbol}\\s?|(,*)`, 'g')
    return ({
      formatter: value => `${currencySymbol} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      parser: value => value.replace(currencyRegExp, ''),
      step
    })
  }
  return ({
    formatter: value => value.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    parser: value => value.replace(/(,*)/g, ''),
    step
  })
}

const CONTROLS = {
  input: ({ input, meta, control, ...props }) => {
    return <Input {...{...input, ...props}} />
  },
  'input-number': ({ input, meta, control, currencySymbol, ...props}) => {
    return <InputNumber {...{...input, ...inputNumberAmountFormatting(currencySymbol), ...props}} />
  },
  textarea: ({ input, meta, control, ...props }) => <Input.TextArea {...{...input, ...props}} />,
  select: ({options, input, meta, control, withEmptyOption, ...props}) => {
    return (
      <Select {...{...input, ...props}}>
        {withEmptyOption && <Select.Option value="">&nbsp;</Select.Option>}
        {options.map(({ label, value }) => <Select.Option key={value} value={value}>{label}</Select.Option>)}
      </Select>
    )
  },
  datepicker: ({ input }) => {
    // transform value to be stored to formatted string
    let value = (input.value && typeof input.value === 'string') ? moment(input.value, datePickerConfig.format) : input.value
    if(!value) value = null
    const onChange = val => input.onChange(val.format(datePickerConfig.format))
    return <DatePicker {...{value, onChange, ...datePickerConfig}} />
  }
}

class FinalField extends React.Component{
  render(){
    const component = this.props.control ? CONTROLS[this.props.control] : (this.props.render ? this.props.render : CONTROLS.input)
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
