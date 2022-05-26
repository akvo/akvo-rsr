import React from 'react'
import { Typography } from 'antd'
import escapeRegExp from 'lodash/escapeRegExp'

const { Text } = Typography

const Highlighted = ({ text = '', highlight = '' }) => {
  if (!highlight || (highlight && !highlight.trim())) {
    return <Text>{text}</Text>
  }
  const regex = new RegExp(`(${escapeRegExp(highlight)})`, 'gi')
  const parts = text.split(regex)
  return (
    <Text>
      {parts.filter(part => part).map((part, i) => (
        regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
      ))}
    </Text>
  )
}

export default Highlighted
