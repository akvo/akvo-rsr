import styled from 'styled-components'

const Section = styled.section`
  background: ${props => {
    if (props.gray) {
      return props.theme.color.gray['100']
    }
    if (props.primary) {
      return props.theme.color.primary['25']
    }
    if (props.gradient) {
      return props.theme.gradient.primary['700-600']
    }
    return props.theme.color.white
  }};
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
export default Section
