import React from 'react'
import { Field } from 'react-final-form'
import { Select } from 'antd'
import FinalField from './final-field'
import {useFetch} from './hooks'

const { Option } = Select

const OrganizationSelect = ({ name, retrieveOrgs }) => {
  const [{results}, loading] = useFetch('/typeaheads/organisations')
  const orgOptions = results ? results.map(it => ({ value: it.id, label: it.name })) : []
  if(results && retrieveOrgs) retrieveOrgs(orgOptions)
  return (
    <Field
      name={`${name}.organisationName`}
      render={(nameProps) => (
        <FinalField
          name={`${name}.organisation`}
          render={({input}) => {
            const options =
              orgOptions.length > 0
              ? orgOptions
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
