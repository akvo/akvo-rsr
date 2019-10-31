import React from 'react'
import { Form, Input, Radio } from 'antd'
import { useTranslation } from 'react-i18next'
import InputLabel from '../../utils/input-label'

const {Item} = Form

const CustomFields = ({ fields }) => {
  const { t } = useTranslation()
  return (
    <div className="custom-fields view">
      <Form layout="vertical">
        {fields.sort((a, b) => a.order - b.order).map(field =>
        <Item label={<InputLabel optional={!field.mandatory} tooltip={field.helpText}>{field.name}</InputLabel>}>
          {field.type === 'text' && <Input.TextArea autosize />}
          {field.type === 'boolean' && <Radio.Group><Radio.Button value="True">{t('Yes')}</Radio.Button><Radio.Button value="False">{t('No')}</Radio.Button></Radio.Group>}
        </Item>
        )}
      </Form>
    </div>
  )
}

export default CustomFields
