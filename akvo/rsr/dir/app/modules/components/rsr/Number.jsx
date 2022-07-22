import styled from 'styled-components'

const Number = styled.span`
  background: ${props => props.theme.gradient.primary['700-600']};
  font-family: ${props => props.theme.font.heading.family};
  font-size: ${props => props.theme.font.heading.md};
  font-weight: ${props => props.theme.font.weight.bold};
  color: ${props => props.theme.color.white};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 98px;
  height: 73px;
  border-radius: 4px 0 0;
  line-height: 24px;
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 0 auto;
  @media (min-width: 768px) and (max-width: 1024px) {
    width: 78px;
  }
`
export default Number
