import styled from 'styled-components'

const Circle = styled.div`
  width: ${props => props.size || '56px'};
  height: ${props => props.size || '56px'};
  color: ${props => props.theme.color.primary['700']};
  background: ${props => props.theme.color.primary['25']};
  box-shadow: ${props => props.theme.boxShadow.sm};
  border-radius: 100%;
  display: grid;
  justify-content: center;
  align-content: center;
  & > .SVGInline {
    width: 24px;
    height: 24px;
  }
`
export default Circle
