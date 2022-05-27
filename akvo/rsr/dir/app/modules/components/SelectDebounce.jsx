import React, { useState } from 'react'
import { Select } from 'antd'
import chunk from 'lodash/chunk'

const { Option } = Select

const SelectDebounce = ({
  options = [],
  className = '',
  max = 25,
  name,
  ...props
}) => {
  const init = options.length ? chunk(options, max) : []
  const [data, setData] = useState(init[0])
  const [open, setOpen] = useState(false)
  let lastFetchId = 0
  const handleOnSearch = keyword => {
    setOpen(true)
    setData(init[0])
    lastFetchId += 1
    const fetchId = lastFetchId
    const filtered = options.filter((op) => op[name].toLowerCase().includes(keyword.toLowerCase()))
    if (fetchId !== lastFetchId) {
      return
    }
    const dataChucked = chunk(filtered, max)
    setData(dataChucked[0])
  }

  return (
    <Select
      labelInValue
      notFoundContent={null}
      mode="multiple"
      open={open}
      filterOption={false}
      className={`w-full ${className}`}
      onSearch={handleOnSearch}
      onFocus={() => setOpen(true)}
      onSelect={() => setOpen(false)}
      {...props}
    >
      {(data && data.length > 0) && data.map(d => (
        <Option key={d.id} value={d.id}>{d[name]}</Option>
      ))}
    </Select>
  )
}

export default SelectDebounce
