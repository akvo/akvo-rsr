import React from 'react'
import classNames from 'classnames'
import './Flex.scss'

const Flex = ({ children, className = '', ...props }) => {
  return (
    <div className={classNames('d-flex', className)}
      {...props}
    >
      {children}
    </div>
  )
}

const Col = ({ children, className = '', ...props }) => {
  return (
    <div className={classNames('col', className)} {...props}>
      {children}
    </div>
  )
}

Flex.Col = Col

export default Flex
