import styled from 'styled-components'
import { Circle } from '../shape'

const Arrow = styled(Circle)`
  position: absolute;
  top: 35%;
  right: -14%;
  z-index: 1;
  &.bottom {
    top: 95%;
    left: 42%;
    transform: rotate(90deg);
  }
`

export const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px 16px;
  gap: 24px;
  height: ${props => props.height || '300px'};
  background: ${props => props.theme.color.white};
  box-shadow: ${props => props.theme.boxShadow.md};
  border-radius: ${props => props.borderRadius || '4px'};
  margin-bottom: ${props => props.theme.space.lg};
  & > .title {
    font-family: ${props => props.theme.font.heading.family};
    font-weight: ${props => props.theme.font.weight.bold};
    font-size: ${props => props.theme.font.size.lg};
    line-height: 19px;
    color: ${props => props.theme.color.gray['900']};
  }
  @media (min-width: 768px) and (max-width: 1280px) {
    margin-bottom: ${props => props.theme.space.md};
    & > .title {
      font-size: ${props => props.theme.font.size.md};
    }
  }
  @media (min-width: 320px) and (max-width: 576px) {
    margin-bottom: ${props => props.theme.space.sm};
    & > .title {
      font-size: ${props => props.theme.font.size.md};
    }
  }
  @media (max-width: 320px) {
    margin-bottom: ${props => props.theme.space.xs};
    & > .title {
      font-size: ${props => props.theme.font.size.md};
    }
  }
`

Card.Arrow = Arrow
