import styled from 'styled-components'
import Heading from './Heading'

export const Title = styled(Heading)`
  position: relative;
  color: ${props => props.color || props.theme.color.gray['900']};
  text-align: ${props => props.align || 'left'};
  @media (min-width: 768px) and (max-width: 1024px) {
    font-size: ${props => props.theme.font.heading.sm};
    line-height: 36px;
    &.features {
      margin-top: 32px;
    }
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
    font-size: ${props => props.theme.font.heading.xs};
    line-height: 36px;
    margin-top: 32px;
  }
`
