import styled from 'styled-components'

const Vstack = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: ${props => props.gap || '16px'};
  justify-content: ${props => props.justify || 'flex-end'};
  align-items: ${props => props.align || 'center'};
`

const Col = styled.div`
  width: ${props => props.width || 10}%;
`

Vstack.Col = Col

export default Vstack
