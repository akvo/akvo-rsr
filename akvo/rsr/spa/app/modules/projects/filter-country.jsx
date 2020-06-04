import React from 'react'
import { Select } from 'antd'
import { useTranslation } from 'react-i18next'
import COUNTRIES from '../../utils/countries.json'

const { Option } = Select
const COUNTRY_OPTIONS = COUNTRIES.map(({ code, name }) => ({ value: code.toLowerCase(), label: name }))

const FilterCountry = ({ onChange, items, size = 'normal' }) => {
  const { t } = useTranslation()
  let options
  if(items) {
    options = COUNTRY_OPTIONS
    .filter(({value}) => items.findIndex(i => i.indexOf(value.toLowerCase()) !== -1) !== -1)
    .map(({ value, label }) => {
      return <Option value={value} data={label}>{label} ({items.filter(it => it.indexOf(value) !== -1).length})</Option>
    })
  }
  else options = COUNTRY_OPTIONS.map(({ value, label }) => <Option value={value} data={label}>{label}</Option>)
  return (
    <Select
      dropdownMatchSelectWidth={false}
      filterOption={(input, option) => {
        const { props: { data } } = option
        return data.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }}
      showSearch
      allowClear
      placeholder={t('All countries')}
      {...{size, onChange}}
    >
      {options}
    </Select>
  )
}

export default FilterCountry
