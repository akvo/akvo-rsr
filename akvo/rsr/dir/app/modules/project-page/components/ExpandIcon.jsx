import React from 'react'
import { Icon } from 'antd'
import classNames from 'classnames'

const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)

export default ExpandIcon
