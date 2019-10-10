import React, { useState } from 'react'
import {Select} from 'antd'
import VOCAB_1_CODES from '../editor/section8/vocab-1-codes.json'
import VOCAB_2_CODES from '../editor/section8/vocab-2-codes.json'

const { Option } = Select

const FilterSector = ({onChange}) => {
  const [customOpt, setCustomOpt] = useState('')
  return (
    <Select
      defaultValue=""
      dropdownMatchSelectWidth={false}
      filterOption={(input, option) => {
        const { props: { data } } = option
        return data.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }}
      showSearch
      onSearch={(str) => {
        setCustomOpt(str)
      }}
      onChange={(value) => {
        setCustomOpt('')
        onChange(value)
      }}
    >
      <Option value="" data="">All sectors</Option>
      {VOCAB_2_CODES.map(item => <Option value={item.value} data={`${item.value} - ${item.label}`}>{item.value} - {item.label}</Option>)}
      {VOCAB_1_CODES.map(item => <Option value={item.value} data={`${item.value} - ${item.label}`}>{item.value} - {item.label}</Option>)}
      {customOpt !== '' &&
      <Option value={customOpt} data={customOpt}>{customOpt}</Option>
      }
    </Select>
  )
}

export default FilterSector
