import React, { useState } from 'react'
import { Select } from 'antd'
import chunk from 'lodash/chunk'

const { Option } = Select

const SelectDebounce = ({ options = [], className = '', name, ...props }) => {
  const [data, setData] = useState([])
  let lastFetchId = 0
  const handleOnSearch = keyword => {
    setData([])
    lastFetchId += 1
    const fetchId = lastFetchId
    const filtered = options.filter((op) => op[name].toLowerCase().includes(keyword.toLowerCase()))
    if (fetchId !== lastFetchId) {
      return
    }
    const dataChucked = chunk(filtered, 10)
    setData(dataChucked[0])
  }

  return (
    <Select
      labelInValue
      notFoundContent={null}
      mode="multiple"
      filterOption={false}
      onSearch={handleOnSearch}
      className={`w-full ${className}`}
      {...props}
    >
      {(data && data.length > 0) && data.map(d => (
        <Option key={d.id} value={d.id}>{d[name]}</Option>
      ))}
    </Select>
  )
}

export default SelectDebounce
