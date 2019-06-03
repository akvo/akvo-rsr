import React from 'react'
import { Input, InputNumber, Select, DatePicker, Form } from 'antd'
import { Field } from 'react-final-form'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { datePickerConfig } from './misc'
import InputLabel from './input-label'
import SectionContext from '../modules/editor/section-context'

const { Item } = Form

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
    const onChange = val => input.onChange(val !== null ? val.format(datePickerConfig.format) : null)
    return <DatePicker {...{value, onChange, ...datePickerConfig}} />
  }
}

const Control = (props) => {
  const { t } = useTranslation()
  const { control, withLabel, optional, fieldExists, label } = props
  if(!control){
    if(!props.render){
      return CONTROLS.input(props)
    }
    return props.render(props)
  }
  if(withLabel){
    const name = props.input.name.split('.').reduce((acc, curr) => curr)
    if(fieldExists && fieldExists(name) === false){
      return null
    }
    return (
    <SectionContext.Consumer>
    {section =>
    <Item label={
      <InputLabel
        optional={typeof optional === 'function' ? optional(name) : optional}
        tooltip={<span dangerouslySetInnerHTML={{__html: t(`${section}:${name}.tooltip`)}} />}
      >
      {label !== undefined ? label : t(`${section}:${name}.label`)}
      </InputLabel>}
    >
      {CONTROLS[control](props)}
    </Item>
    }
    </SectionContext.Consumer>)
  }
  return CONTROLS[control](props)
}

class FinalField extends React.Component{
  render(){
    return (
      <Field
        name={this.props.name}
        component={Control}
        {...this.props}
      />
    )
  }
}
// FinalField.contextType = SectionContext

export default FinalField
