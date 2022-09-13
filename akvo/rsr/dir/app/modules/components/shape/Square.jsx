import styled from 'styled-components'

const Square = styled.span`
  background: ${props => `${props.color || props.theme.gradient.primary['700-600']}`};
  width: ${props => props.size || '18px'};
  height: ${props => props.size || '18px'};
  padding: ${props => props.space || '10px'};
  border-radius: 4px;
`

export default Square
