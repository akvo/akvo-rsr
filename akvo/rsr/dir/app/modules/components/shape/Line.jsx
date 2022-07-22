import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: ${props => {
    if (props.center) {
      return 'center'
    }
    if (props.right) {
      return 'flex-end'
    }
    return 'flex-start'
  }};
  align-items: center;
  margin-top: 8px;
`

const Shape = styled.span`
  border-bottom: 4px solid ${props => props.theme.color.primary['700']};
  border-radius: 4px;
  content: "";
  width: 64px;
`

const Line = props => {
  return (
    <Wrapper {...props}>
      <Shape />
    </Wrapper>
  )
}

export default Line
