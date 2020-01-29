import React, { useState } from 'react'
import { Input, Icon, Spin } from 'antd'
// import { useTranslation } from 'react-i18next'

let tmid

const Search = ({ onChange, onClear, loading }) => {
  const [text, setText] = useState('')
  // const { t } = useTranslation()
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
      placeholder="Find a project..."
      onChange={handleChange}
    />
  )
}

export default Search
