import styled from 'styled-components'

export const Image = styled.div`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '276px'};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
`

Image.Number = styled.span`
  width: 98px;
  height: 73px;
  border-radius: 4px 0 0;
  background: ${props => props.theme.gradient.primary['700-600']};
  font-family: ${props => props.theme.font.heading.family};
  font-size: ${props => props.theme.font.heading.md};
  font-weight: ${props => props.theme.font.weight.bold};
  color: ${props => props.theme.color.white};
  line-height: 24px;
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  @media (min-width: 768px) and (max-width: 1024px) {
    width: 78px;
  }
`
