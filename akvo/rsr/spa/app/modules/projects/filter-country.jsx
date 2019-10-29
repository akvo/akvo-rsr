import React from 'react'
import { Select } from 'antd'
import { useTranslation } from 'react-i18next'
import COUNTRIES from '../../utils/countries'

const { Option } = Select
const COUNTRY_OPTIONS = COUNTRIES.map(({ code, name }) => ({ value: code.toLowerCase(), label: name }))

const FilterCountry = ({ onChange }) => {
  const { t } = useTranslation()
  return (
    <Select
      defaultValue=""
      dropdownMatchSelectWidth={false}
      filterOption={(input, option) => {
        const { props: { data } } = option
        return data.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }}
      showSearch
      onChange={onChange}
    >
      <Option value="" data="">{t('All countries')}</Option>
      {COUNTRY_OPTIONS.map(({value, label}) => <Option value={value} data={label}>{label}</Option>)}
    </Select>
  )
}

export default FilterCountry
