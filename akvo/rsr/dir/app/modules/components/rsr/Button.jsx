/* global window */
import React from 'react'
import styled from 'styled-components'
import { Button as AntButton } from 'antd'
import { useHistory } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'

const Btn = styled.button`
  width: ${props => props.block ? '100%' : props.width || 'fit-content'};
  border: ${props => props.border || `2px solid  ${props.theme.color.primary['700']}`};
  font-weight: ${props => props.theme.font.weight.bold};
  color: ${props => props.theme.color.primary['700']};
  padding: 10px 32px;
  border-radius: 0;
  cursor: pointer;
  background: transparent;
  &:hover {
    color: ${props => props.theme.color.white};
    background: ${props => props.theme.color.primary['700']};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .SVGInline {
    margin-left: 12px;
  }
  @media (min-width: 577px) and (max-width: 767px) {
    padding: 10px 16px; 
  }
`

const Wrapper = styled.div`
  .ant-btn.ant-btn-link {
    width: fit-content;
    padding: 0;
    font-weight: ${props => props.theme.font.weight.bold};
    &:hover {
      border-bottom: 2px solid ${props => props.theme.color.primary['700']};
      border-radius: 0;
    }
    * {
      margin-right: 10px;
    }
  }
`

export const Button = ({
  href,
  onClick,
  children,
  loading = false,
  blank = false,
  params = null,
  antd = false,
  ...props
}) => {
  const history = useHistory()
  return antd
    ? (
      <Wrapper>
        <AntButton href={href} {...props}>
          {children}
        </AntButton>
      </Wrapper>
    )
    : (
      <Btn
        onClick={() => {
          if (onClick) {
            onClick(params)
          }
          if (href && !blank) {
            history.push(href)
          }
          if (href && blank) {
            window.open(href, '_blank')
          }
        }}
        {...props}
      >
        {loading && <><LoadingOutlined />{' '}</>}{children}
      </Btn>
    )
}
