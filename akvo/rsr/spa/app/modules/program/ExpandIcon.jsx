import React from 'react'
import classNames from 'classnames'
import { Icon } from 'antd'

const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)

export default ExpandIcon
