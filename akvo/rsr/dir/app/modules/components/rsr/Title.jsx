import styled from 'styled-components'

export const Title = styled.h1`
  color: ${props => props.theme.color.gray['900']};
  font-family: ${props => props.theme.font.heading.family};
  font-weight: ${props => props.theme.font.weight.bold};
  font-size: ${props => props.size ? props.theme.font.heading[props.size] || props.theme.font.heading.md : props.theme.font.heading.md};
  line-height: 48px;
  text-align: left;
  @media (min-width: 768px) and (max-width: 1024px) {
    font-size: ${props => props.theme.font.heading.sm};
    line-height: 36px;
  }
  @media (min-width: 577px) and (max-width: 767px) {
    font-size: ${props => props.theme.font.heading.sm};
    line-height: 36px;
  }
  @media (min-width: 320px) and (max-width: 576px) {
    font-size: ${props => props.theme.font.heading.sm};
    line-height: 36px;
    margin-top: 32px;
  }
  @media (max-width: 320px) {
    font-size: ${props => props.theme.font.heading.sm};
    line-height: 36px;
    margin-top: 32px;
  }
`
