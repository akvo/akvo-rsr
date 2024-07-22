/* eslint-disable react/no-danger */
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
    formatter: value => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    parser: value => value.replace(/(,*)/g, ''),
    step
  })
}

const CONTROLS = {
  input: ({ input, meta, control, ...props }) => {
    return <Input {...{ ...input, ...props}} />
  },
  'input-number': ({ input, meta, control, currencySymbol, ...props}) => (
    <InputNumber {...input} {...props} {...inputNumberAmountFormatting(currencySymbol)} />
  ),
  textarea: ({ input, meta, control, ...props }) => <Input.TextArea {...{...input, ...props}} />,
  select: ({options, input, meta, control, withEmptyOption, withValuePrefix, ...props}) => {
    return (
      <Select {...{...input, ...props}}>
        {withEmptyOption && <Select.Option value="">&nbsp;</Select.Option>}
        {options.map(({ label, value, small }) => <Select.Option key={value} value={value}>{withValuePrefix && `${value} - `}{label}{small && <small>&nbsp;{small}</small>}</Select.Option>)}
      </Select>
    )
  },
  datepicker: ({ input, disabled, ...props }) => {
    // transform value to be stored to formatted string
    let value = (input.value && typeof input.value === 'string') ? moment(input.value, datePickerConfig.format) : input.value
    if(!value) value = null
    const _props = {...props}
    for(let i = 1; i <= 11; i += 1) delete _props[`section${i}`]
    // console.log(_props)
    const onChange = val => input.onChange(val !== null ? val.format(datePickerConfig.format) : null)
    return <DatePicker {...{value, onChange, disabled, ...datePickerConfig, ..._props}} />
  },
  rte: ({ input }) => <RTE {...input} />
}

const Control = (props) => {
  const section = useContext(SectionContext)
  const { t } = useTranslation()
  const {
    control,
    withLabel,
    dict,
    withoutTooltip,
    optional,
    fieldExists,
    label,
    addingItem,
    showRequired,
    backendError,
    children,
    dispatch,
    render,
    section1,
    section2,
    section3,
    section4,
    section5,
    section6,
    section7,
    section8,
    section9,
    section10,
    section11,
    ..._props } = props
  const disabled = props.disabled || addingItem
  let validateStatus = ''
  let help = ''
  let requiredValidationError = false
  const err = props[section].errors.find(it => it.path === props.input.name)
  if (showRequired && err) {
    validateStatus = 'error'
    if(err.type === 'typeError' && err.message) help = err.message
  }
  if(err && err.type === 'required'){
    requiredValidationError = true
  }
  if (backendError && `section${backendError.sectionIndex}` === section && (props.input.name === `${backendError.setName}.${Object.keys(backendError.response)[0]}` || props.input.name === Object.keys(backendError.response)[0])){
    validateStatus = 'error'
    help = backendError.response[Object.keys(backendError.response)[0]]
  }
  if(!control){
    if(!props.render){
      return CONTROLS.input({..._props, disabled, validateStatus})
    }
    return props.render({ ..._props, disabled, validateStatus, showRequired})
  }
  if(withLabel){
    const name = props.input.name.split('.').reduce((acc, curr) => curr)
    if(fieldExists && fieldExists(name) === false){
      return null
    }
    return (
      <Item
        colon={false}
        validateStatus={validateStatus}
        help={help}
        label={
          label ? label :
            <InputLabel
              optional={requiredValidationError ? false : typeof optional === 'function' ? optional(name) : optional}
              tooltip={(withoutTooltip || (dict && !dict.tooltip)) ? null : dict ? dict.tooltip : t(`${section}::${name}::tooltip`)}
            >
              {dict ? dict.label : `${t(`${section}::${name}::label`)} :`}
            </InputLabel>}
      >
        {CONTROLS[control]({..._props, disabled})}
      </Item>
    )
  }
  return CONTROLS[control]({..._props, disabled})
}

const FinalField = ({name, ...props}) => {
  return (
    <Field
      name={name}
      component={Control}
      {...props}
    />
  )
}

export default connect(
  ({ editorRdr }) => {
    const { addingItem, showRequired, backendError } = editorRdr
    const props = ({ addingItem, showRequired, backendError })
    // bind validation errors (required) for all sections
    times(11).forEach((i) => {
      const sectionKey = `section${i + 1}`
      props[sectionKey] = { errors: editorRdr[sectionKey].errors.filter(it => it.type === 'required' || it.type === 'typeError' || (it.type === 'min' && it.path !== undefined))}
    })
    return props
  })(
  React.memo(FinalField, (prevProps, nextProps) => isEqual(prevProps, nextProps))
)
