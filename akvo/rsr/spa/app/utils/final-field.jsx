import React, { useContext } from 'react'
import { connect } from 'react-redux'
import { Input, InputNumber, Select, DatePicker, Form } from 'antd'
import { Field } from 'react-final-form'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { isEqual, times } from 'lodash'
import { datePickerConfig } from './misc'
import InputLabel from './input-label'
import RTE from './rte'
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
  select: ({options, input, meta, control, withEmptyOption, withValuePrefix, ...props}) => {
    return (
      <Select {...{...input, ...props}}>
        {withEmptyOption && <Select.Option value="">&nbsp;</Select.Option>}
        {options.map(({ label, value }) => <Select.Option key={value} value={value}>{withValuePrefix && `${value} - `}{label}</Select.Option>)}
      </Select>
    )
  },
  datepicker: ({ input, disabled }) => {
    // transform value to be stored to formatted string
    let value = (input.value && typeof input.value === 'string') ? moment(input.value, datePickerConfig.format) : input.value
    if(!value) value = null
    const onChange = val => input.onChange(val !== null ? val.format(datePickerConfig.format) : null)
    return <DatePicker {...{value, onChange, disabled, ...datePickerConfig}} />
  },
  rte: ({ input }) => <RTE {...input} />
}

const Control = (props) => {
  const section = useContext(SectionContext)
  const { t } = useTranslation()
  const { control, withLabel, withoutTooltip, optional, fieldExists, label, addingItem, showRequired, ..._props } = props
  const disabled = props.disabled || addingItem
  let validateStatus = ''
  if (showRequired && props[section].errors.findIndex(it => it.path === props.input.name) !== -1) {
    validateStatus = 'error'
  }
  if(!control){
    if(!props.render){
      return CONTROLS.input({..._props, disabled, validateStatus})
    }
    return props.render({..._props, disabled, validateStatus})
  }
  if(withLabel){
    const name = props.input.name.split('.').reduce((acc, curr) => curr)
    if(fieldExists && fieldExists(name) === false){
      return null
    }
    return (
    <Item
      validateStatus={validateStatus}
      label={
      label ? label :
      <InputLabel
        optional={typeof optional === 'function' ? optional(name) : optional}
        tooltip={withoutTooltip ? null : <span dangerouslySetInnerHTML={{__html: t(`${section}::${name}::tooltip`)}} />}
      >
      {t(`${section}::${name}::label`)}
      </InputLabel>}
    >
      {CONTROLS[control]({..._props, disabled})}
    </Item>
    )
  }
  return CONTROLS[control](_props)
}

const FinalField = ({name, ...props}) => (
  <Field
    name={name}
    component={Control}
    {...props}
  />
)
// FinalField.contextType = SectionContext

export default connect(
  ({ editorRdr }) => {
    const props = ({ addingItem: editorRdr.addingItem, showRequired: editorRdr.showRequired })
    // bind validation errors (required) for all sections
    times(11).forEach((i) => {
      const sectionKey = `section${i + 1}`
      props[sectionKey] = { errors: editorRdr[sectionKey].errors.filter(it => it.type === 'required' || (it.type === 'min' && it.path !== undefined))}
    })
    return props
  })(
  React.memo(FinalField, (prevProps, nextProps) => isEqual(prevProps, nextProps))
)
// export default FinalField
