import React, { useState } from 'react'
import { CloseOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons'
import { Input, Spin, Popover } from 'antd'
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
          suffix={text === '' ? <SearchOutlined /> : (loading && text !== '' ? <Spin indicator={<LoadingOutlined style={{ fontSize: 18 }} spin />} /> : <CloseOutlined onClick={handleClear} />)}
          placeholder={t('Find a project')}
          onChange={handleChange}
        />
      </Popover>
    )
    : (
      <Input
        value={text}
        suffix={text === '' ? <SearchOutlined /> : (loading && text !== '' ? <Spin indicator={<LoadingOutlined style={{ fontSize: 18 }} spin />} /> : <CloseOutlined onClick={handleClear} />)}
        placeholder={t('Find a project')}
        onChange={handleChange}
      />
    )
}

export default Search
