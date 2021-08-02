import React, { useState } from 'react'
import { Input, Icon, Spin, Popover } from 'antd'
import { useTranslation } from 'react-i18next'
import { SearchResult } from '../wcaro-index/components'

let tmid

const Search = ({ onChange, onClear, loading, items }) => {
  const { t } = useTranslation()
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

  return items
    ? (
      <Popover placement="bottom" content={<SearchResult {...{ items }} />}>
        <Input
          value={text}
          suffix={text === '' ? <Icon type="search" /> : (loading && text !== '' ? <Spin indicator={<Icon type="loading" style={{ fontSize: 18 }} spin />} /> : <Icon onClick={handleClear} type="close" />)}
          placeholder={t('Find a project')}
          onChange={handleChange}
        />
      </Popover>
    )
    : (
      <Input
        value={text}
        suffix={text === '' ? <Icon type="search" /> : (loading && text !== '' ? <Spin indicator={<Icon type="loading" style={{ fontSize: 18 }} spin />} /> : <Icon onClick={handleClear} type="close" />)}
        placeholder={t('Find a project')}
        onChange={handleChange}
      />
    )
}

export default Search
