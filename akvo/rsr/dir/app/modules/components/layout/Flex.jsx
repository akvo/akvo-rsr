import styled from 'styled-components'

const Flex = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.gap || props.theme.space.lg};
  @media (min-width: 768px) and (max-width: 1024px) {
    gap: ${props => props.gap || props.theme.space.md};
  }
  @media (min-width: 577px) and (max-width: 767px) {
    gap: ${props => props.gap || props.theme.space.sm};
  }
  @media (max-width: 320px) {
    gap: ${props => props.gap || props.theme.space.xs};
  }
`
export default Flex
