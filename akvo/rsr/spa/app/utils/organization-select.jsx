import React from 'react'
import FinalField from './final-field'
import {useFetch} from './hooks'

const OrganizationSelect = ({ name, retrieveOrgs }) => {
  const [{results}, loading] = useFetch('/typeaheads/organisations')
  const options = results ? results.map(it => ({ value: it.id, label: it.name })) : []
  if(results && retrieveOrgs) retrieveOrgs(options)
  return (
    <FinalField
      name={name}
      control="select"
      options={options}
      showSearch
      optionFilterProp="children"
      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    />
  )
}

export default OrganizationSelect
