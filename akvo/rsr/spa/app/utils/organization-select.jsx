import React from 'react'
import { Field } from 'react-final-form'
import { Select, Form } from 'antd'
import FinalField from './final-field'

const { Option } = Select
const { Item } = Form

const OrganizationSelect = ({ name, orgs, loading, disabled }) => {
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
              <Item validateStatus={validateStatus} label="Organisation">
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
