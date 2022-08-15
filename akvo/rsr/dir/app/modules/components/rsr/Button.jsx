/* global window */
import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

const Btn = styled.button`
  cursor: pointer;
  width: ${props => props.block ? '100%' : props.width || '146px'};
  border-radius: 0;
  padding: 10px 32px;
  border: 2px solid ${props => props.theme.color.primary['700']};
  font-weight: ${props => props.theme.font.weight.bold};
  color: ${props => props.theme.color.primary['700']};
  background: transparent;
  &:hover {
    color: ${props => props.theme.color.white};
    background: ${props => props.theme.color.primary['700']};
  }
  @media (min-width: 577px) and (max-width: 767px) {
    padding: 10px 16px; 
  }
`
export const Button = ({ href, onClick, children, blank = false, params = null, ...props }) => {
  const history = useHistory()
  return (
    <Btn
      onClick={(e) => {
        if (onClick) {
          onClick(params)
        }
        if (href && !blank) {
          history.push(href)
        }
        if (href && blank) {
          window.open(href, '_blank')
        }
        e.preventDefault()
      }}
      {...props}
    >
      {children}
    </Btn>
  )
}
