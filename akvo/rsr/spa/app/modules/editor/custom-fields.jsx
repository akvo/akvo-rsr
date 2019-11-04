import React, { useState, useRef } from 'react'
import { Form, Input, Radio } from 'antd'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import InputLabel from '../../utils/input-label'
import api from '../../utils/api'
import { updateLastSaved, saving } from './actions'

const {Item} = Form

const CustomField = connect(null, { updateLastSaved, saving })(({ field, updateLastSaved, saving }) => { // eslint-disable-line
  const { t } = useTranslation()
  const tmidRef = useRef()
  const [value, setValue] = useState(field.value)
  const updateValue = (value, timeout = 1000) => { // eslint-disable-line
    setValue(value)
    if (tmidRef.current) clearTimeout(tmidRef.current)
    tmidRef.current = setTimeout(() => {
      saving()
      api.patch(`/project_custom_field/${field.id}/`, { value }).then(() => {
        updateLastSaved()
      })
    }, timeout)
  }
  return (
    <Item label={<InputLabel optional={!field.mandatory} tooltip={field.helpText}>{field.name}</InputLabel>}>
      {field.type === 'text' && <Input.TextArea autosize value={value} onChange={({target}) => updateValue(target.value)} />}
      {field.type === 'boolean' && <Radio.Group value={value} onChange={({target}) => updateValue(target.value, 0)}><Radio.Button value="True">{t('Yes')}</Radio.Button><Radio.Button value="False">{t('No')}</Radio.Button></Radio.Group>}
    </Item>
  )
})

const CustomFields = ({ fields }) => {
  return (
    <div className="custom-fields view">
      <Form layout="vertical">
        {fields.sort((a, b) => a.order - b.order).map(field => <CustomField field={field} />)}
      </Form>
    </div>
  )
}

export default CustomFields
