import styled from 'styled-components'

export const VStack = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: ${props => props.gap || '16px'};
  justify-content: ${props => props.justify || 'flex-end'};
  align-items: ${props => props.align || 'center'};
`

VStack.Col = styled.div`
  width: ${props => props.width || 10}%;
`
