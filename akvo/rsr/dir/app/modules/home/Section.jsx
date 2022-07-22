import styled from 'styled-components'

export const Section = styled.section`
  background-color: ${props => props.gray ? props.theme.color.gray['100'] : props.theme.color.white};
  padding: ${props => props.theme.space.lg};
  @media (min-width: 577px) and (max-width: 767px) {
    padding: ${props => props.theme.space.md};
  }
  @media (min-width: 320px) and (max-width: 576px) {
    padding: ${props => props.theme.space.sm};
  }
  @media (max-width: 320px) {
    padding: ${props => props.theme.space.xs};
  }
`
