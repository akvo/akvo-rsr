/* eslint-disable react/button-has-type */
/* global window */
import { Button } from 'antd'
import classNames from 'classnames'
import React from 'react'
import { useHistory } from 'react-router-dom'

const External = ({
  className = '',
  type = 'button',
  block = false,
  href = null,
  blank = false,
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
    <button type={type} className={classNames(`rsr-btn-external ${className}`, { block })} {...props}>
      {children}
    </button>
  )
}

const Internal = ({
  className = '',
  type = 'button',
  block = false,
  href = null,
  children,
  ...props
}) => {
  const history = useHistory()
  return (
    <button type={type} className={classNames(`rsr-btn-external ${className}`, { block })}
      onClick={() => {
        if (props.onClick) props.onClick()
        if (href) history.push(href)
      }}
      {...props}
    >
      {children}
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
