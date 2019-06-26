import React from 'react'
import { Field } from 'react-final-form'
import { Select } from 'antd'
import FinalField from './final-field'

const { Option } = Select

const OrganizationSelect = ({ name, orgs, loading }) => {
  return (
    <Field
      name={`${name}.organisationName`}
      render={(nameProps) => (
        <FinalField
          name={`${name}.organisation`}
          render={({input}) => {
            const options =
              orgs.length > 0
              ? orgs.map(it => ({ value: it.id, label: it.name }))
              : [{ value: input.value, label: nameProps.input.value }]
            return (
              <Select
                {...input}
                showSearch
                loading={loading}
                optionFilterProp="children"
                filterOption={(val, option) => option.props.children.toLowerCase().indexOf(val.toLowerCase()) >= 0}
              >
                {options.map(option => <Option value={option.value} key={option.value}>{option.label}</Option>)}
              </Select>
            )
          }}
        />
      )}
    />
  )
}

export default OrganizationSelect
