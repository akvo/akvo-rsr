import styled from 'styled-components'

export const Space = styled.section`
  margin: ${props => props.y ? props.y.lg || props.theme.margin.lg : props.theme.margin.lg} ${props => props.x || '0px'};
  @media (min-width: 577px) and (max-width: 767px) {
    margin: ${props => props.y ? props.y.md || props.theme.margin.md : props.theme.margin.md} ${props => props.x || '0px'};
  }
  @media (min-width: 320px) and (max-width: 576px) {
    margin: ${props => props.y ? props.y.sm || props.theme.margin.sm : props.theme.margin.sm}  ${props => props.x || '0px'};
  }
  @media (max-width: 320px) {
    margin: ${props => props.y ? props.y.xs || props.theme.margin.xs : props.theme.margin.xs}  ${props => props.x || '0px'};
  }
`
