/* eslint-disable react/button-has-type */
/* global window */
import { Button, Icon } from 'antd'
import classNames from 'classnames'
import React from 'react'
import { useHistory } from 'react-router-dom'

const External = ({
  className = '',
  type = 'button',
  block = false,
  href = null,
  blank = false,
  loading = false,
  children,
  ...props
}) => {
  props = href
    ? {
      ...props,
      onClick: () => {
        window.open(href, blank ? '_blank' : '')
      }
    }
    : props
  return (
    <button type={type} className={classNames(`rsr-btn-external ${className}`, { block, 'ant-btn-loading': loading })} {...props}>
      {loading && <><Icon type="loading" />&nbsp;</>}{children}
    </button>
  )
}

const Internal = ({
  className = '',
  type = 'button',
  block = false,
  href = null,
  loading = false,
  children,
  ...props
}) => {
  const history = useHistory()
  return (
    <button type={type} className={classNames(`rsr-btn-external ${className}`, { block, 'ant-btn-loading': loading })}
      onClick={() => {
        if (props.onClick) props.onClick()
        if (href) history.push(href)
      }}
      {...props}
    >
      {loading && <><Icon type="loading" />&nbsp;</>}{children}
    </button>
  )
}

const RsrButton = ({ children, ...props }) => (
  <Button {...props}>
    {children}
  </Button>
)

RsrButton.External = External
RsrButton.Internal = Internal

export default RsrButton
