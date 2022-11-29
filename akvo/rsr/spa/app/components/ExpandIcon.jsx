import React from 'react'
import classNames from 'classnames'
import { Icon } from 'antd'

const ExpandIcon = ({ isActive, open = 'down', close = 'down' }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type={isActive ? open : close} />
  </div>
)

export default ExpandIcon
