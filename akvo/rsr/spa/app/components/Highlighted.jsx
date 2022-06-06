import React from 'react'
import escapeRegExp from 'lodash/escapeRegExp'

const Highlighted = ({ text = '', highlight = '' }) => {
  if (!highlight || (highlight && !highlight.trim())) {
    return <>{text}</>
  }
  const regex = new RegExp(`(${escapeRegExp(highlight)})`, 'gi')
  const parts = text.split(regex)
  return (
    <>
      {parts.filter(part => part).map((part, i) => (
        regex.test(part) ? <mark key={i}>{part}</mark> : <React.Fragment key={i}>{part}</React.Fragment>
      ))}
    </>
  )
}

export default Highlighted
