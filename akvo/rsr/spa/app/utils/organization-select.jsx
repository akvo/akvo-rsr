import React from 'react'
import { Field } from 'react-final-form'
import { Select, Form } from 'antd'
import { useTranslation } from 'react-i18next'
import FinalField from './final-field'
import InputLabel from './input-label';

const { Option } = Select
const { Item } = Form

const OrganizationSelect = ({ name, orgs, loading, disabled }) => {
  const { t } = useTranslation()
  return (
    <Field
      name={`${name}.organisationName`}
      render={(nameProps) => (
        <FinalField
          name={`${name}.organisation`}
          render={({input, validateStatus}) => {
            const options =
              orgs && orgs.length > 0
              ? orgs.map(it => ({ value: it.id, label: it.name }))
              : [{ value: input.value, label: nameProps.input.value }]
            return (
              <Item validateStatus={validateStatus} label={<InputLabel tooltip={t('section3.organisation.tooltip')}>{t('section3.organisation.label')}</InputLabel>}>
              <Select
                {...input}
                disabled={disabled}
                showSearch
                loading={loading}
                optionFilterProp="children"
                filterOption={(val, option) => option.props.children.toLowerCase().indexOf(val.toLowerCase()) >= 0}
              >
                {options.map(option => <Option value={option.value} key={option.value}>{option.label}</Option>)}
              </Select>
              </Item>
            )
          }}
        />
      )}
    />
  )
}

export default OrganizationSelect
