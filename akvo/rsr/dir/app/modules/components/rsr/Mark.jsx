import styled from 'styled-components'

export const Mark = styled.mark`
  color: ${props => props.theme.color.white};
  font-family: ${props => props.theme.font.heading.family};
  font-weight: ${props => props.theme.font.weight.bold};
  font-size: ${props => props.theme.font.heading.xl};
  font-style: normal;
  line-height: 72px;
  margin-bottom: 8px;
  padding: 4px 20px 4px 8px;
  background: ${props => props.theme.gradient.primary['700-600']};
  &:nth-child(3) {
    margin-bottom: 24px;
  }
`
