import styled from 'styled-components'

export const Paragraph = styled.div`
  font-family: ${props => props.theme.font.family};
  font-weight: ${props => props.theme.font.weight.normal};
  font-size: ${props => props.theme.font.size[props.size || 'md']};
  color: ${props => props.theme.color.gray['900']};
  text-align: ${props => props.align || 'left'};
  font-style: normal;
  line-height: 24px;

  @media (min-width: 768px) and (max-width: 1280px) {
    font-size: ${props => props.theme.font.size.sm};
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
