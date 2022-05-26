/* eslint-disable react/button-has-type */
/* global window */
import { Button } from 'antd'
import classNames from 'classnames'
import React from 'react'

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
    <button
      type={type}
      className={classNames(
        `rsr-btn-external ${className}`,
        {
          'block': block
        }
      )}
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

export default RsrButton
