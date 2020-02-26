import React, { useState } from 'react'
import { Input, Icon, Spin } from 'antd'

let tmid

const Search = ({ onChange, onClear, loading, placeholder }) => {
  const [text, setText] = useState('')
  const handleChange = ({ target: { value } }) => {
    clearTimeout(tmid)
    setText(value)
    tmid = setTimeout(() => onChange(value), 500)
  }
  const handleClear = () => {
    setText('')
    onClear()
  }
  return (
    <Input
      value={text}
      suffix={text === '' ? <Icon type="search" /> : (loading && text !== '' ? <Spin indicator={<Icon type="loading" style={{ fontSize: 18 }} spin />} /> : <Icon onClick={handleClear} type="close" />)}
      {...{placeholder}}
      onChange={handleChange}
    />
  )
}

export default Search
