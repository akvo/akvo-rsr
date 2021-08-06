import React from 'react'
import { Icon } from 'antd'

export const IconText = ({ type, text }) => (
  <span className="wcaro-small-text small-primary">
    <Icon style={{ marginRight: 8 }} type={type} />
    {text}
  </span>
)
