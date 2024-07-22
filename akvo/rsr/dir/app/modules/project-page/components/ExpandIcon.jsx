import React from 'react'
import { DownOutlined } from '@ant-design/icons'
import classNames from 'classnames'

const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <DownOutlined />
  </div>
)

export default ExpandIcon
