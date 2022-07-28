import styled from 'styled-components'

export const Paragraph = styled.p`
  font-family: ${props => props.theme.font.family};
  font-style: normal;
  font-weight: ${props => props.theme.font.weight.normal};
  font-size: ${props => props.theme.font.size.lg};
  color: ${props => props.theme.color.gray['900']};

  @media (min-width: 768px) and (max-width: 1024px) {
    font-size: ${props => props.theme.font.size.md};
  }
  @media (min-width: 577px) and (max-width: 767px) {
    font-size: ${props => props.theme.font.size.sm};
  }
  @media (min-width: 320px) and (max-width: 576px) {
    font-size: ${props => props.theme.font.size.sm};
  }
  @media (max-width: 320px) {
    font-size: ${props => props.theme.font.size.xs};
  }
`
