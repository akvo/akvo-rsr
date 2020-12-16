import { get } from 'lodash'
import React, { useState, useRef } from 'react'
import { Form, Input, Radio, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import InputLabel from '../../utils/input-label'
import api from '../../utils/api'
import { updateLastSaved, saving, setFieldRequiredError } from './actions'
import actionTypes from './action-types'

const {Item} = Form

const CustomDropdownField = ({options, selection, onChange}) => {
  const mode = options.multiselect ? 'multiple' : 'single'
  return (
    <Select mode={mode} defaultValue={selection} onChange={onChange}>
      {options.options.map(option => (<Select.Option value={option.name}>{option.name}</Select.Option>))}
    </Select>
  )
}

const CustomField = connect(({ editorRdr: { showRequired } }) => ({ showRequired }), { updateLastSaved, saving, setFieldRequiredError })(({ field, updateLastSaved, saving, showRequired, setFieldRequiredError }) => { // eslint-disable-line
  const { t } = useTranslation()
  const tmidRef = useRef()
  const [value, setValue] = useState(field.value)
  const updateValue = (value, timeout = 2000) => { // eslint-disable-line
    setValue(value)
    if (tmidRef.current) clearTimeout(tmidRef.current)
    tmidRef.current = setTimeout(() => {
      saving()
      api.patch(`/project_custom_field/${field.id}/`, { value }, null, null, true).then(() => {
        updateLastSaved()
        if(field.mandatory){
          setFieldRequiredError(field.section, `custom-field-${field.id}`, !value)
        }
      })
    }, timeout)
  }
  return (
    <Item validateStatus={(showRequired && field.mandatory && (value === '' || !value)) ? 'error' : ''} label={<InputLabel optional={!field.mandatory} tooltip={field.helpText}>{field.name}</InputLabel>}>
      {field.type === 'text' && <Input.TextArea autosize value={value} onChange={({target}) => updateValue(target.value)} />}
      {field.type === 'boolean' && <Radio.Group value={value} onChange={({target}) => updateValue(target.value, 0)}><Radio.Button value="True">{t('Yes')}</Radio.Button><Radio.Button value="False">{t('No')}</Radio.Button></Radio.Group>}
    </Item>
  )
})

const updateCustomField = ({item, fieldName}) => (dispatch, getState) => {
  const setName = `${fieldName}.customValues`
  const sectionIndex = 5
  const customValues = get(getState().editorRdr[`section${sectionIndex}`].fields, setName)
  const itemIndex = customValues.findIndex(it => it.id === item.id)
  if (itemIndex > -1) {
    dispatch({ type: actionTypes.EDIT_SET_ITEM, sectionIndex, setName, itemIndex, fields: item })
  } else {
    dispatch({ type: actionTypes.ADD_SET_ITEM, sectionIndex, setName, item })
  }
}

const IndicatorCustomField = connect(({ editorRdr: { showRequired } }) => ({ showRequired }), { updateLastSaved, saving, setFieldRequiredError, updateCustomField  })(({ field, fieldName, updateCustomField, updateLastSaved, saving, showRequired, setFieldRequiredError, }) => { //eslint-disable-line
  const { t } = useTranslation()
  const tmidRef = useRef()
  const [value, setValue] = useState(field.value)
  const updateValue = (value, timeout = 2000) => { // eslint-disable-line
    setValue(value)
    if (tmidRef.current) clearTimeout(tmidRef.current)
    tmidRef.current = setTimeout(() => {
      saving()
      const pathPrefix = '/indicator_custom_value/'
      const url = field.id ? `${pathPrefix}${field.id}/` : pathPrefix
      const apiCall = field.id ? api.patch : api.post
      let data
      switch(field.type) {
        case 'text':
          data = {textValue: value}
          break
        case 'boolean':
          data = {booleanValue: value}
          break
        case 'dropdown':
          data = {dropdownSelection: value}
          break
        default:
          data = {value}
          break
      }
      if (!field.id) {
        data = {...data, ...field}
      }
      apiCall(url, data, null, null, true).then(({data: item}) => {
        updateCustomField({item, fieldName})
        updateLastSaved()
        if(field.mandatory){
          setFieldRequiredError(5, `custom-field-${field.id}`, !value)
        }
      })
    }, timeout)
  }
  return (
    <Item validateStatus={(showRequired && field.mandatory && (value === '' || !value)) ? 'error' : ''} label={<InputLabel optional={!field.mandatory} tooltip={field.helpText}>{field.name}</InputLabel>}>
      {field.type === 'text' && <Input.TextArea autosize value={value} onChange={({target}) => updateValue(target.value)} />}
      {field.type === 'boolean' && <Radio.Group value={value} onChange={({target}) => updateValue(target.value, 0)}><Radio.Button value="True">{t('Yes')}</Radio.Button><Radio.Button value="False">{t('No')}</Radio.Button></Radio.Group>}
      {field.type === 'dropdown' && field.indicator && <CustomDropdownField options={field.dropdownOptions} selection={field.dropdownSelection} onChange={val => updateValue(val)} />}
    </Item>
  )
})

const mergeFieldsWithValues = (fields, values, indicator) => {
  const merged = fields.map(field => {
    const data = values?.find(it => it.customField === field.id)
    const {id: customField, ...fieldRest} = field
    const value = data ? (field.type === 'text' ? data.textValue : data.booleanValue) : undefined
    const merge = {customField, indicator, value, ...fieldRest, ...data}
    return merge
  })
  return merged
}

export const CustomFields = ({ fields }) => {
  return (
    <div className="custom-fields view">
      <Form layout="vertical">
        {fields.sort((a, b) => a.order - b.order).map(field => <CustomField field={field} />)}
      </Form>
    </div>
  )
}

export const IndicatorCustomFields = ({ fields, values, indicator, name }) => {
  const mergedFields = mergeFieldsWithValues(fields, values, indicator)
  if(mergedFields.length === 0) return null
  return (
    <div className="indicator-custom-fields view">
      <Form layout="vertical">
        {mergedFields.sort((a, b) => a.order - b.order).map(field => <IndicatorCustomField key={`${field.indicator}-${field.customField}`} field={field} fieldName={name} />)}
      </Form>
    </div>
  )
}
