import styled from 'styled-components'

const Vstack = styled.div`
  display: flex;
  flex-direction: column;
  div, span, a, p {
    margin-bottom: ${props => props.space || '16px'};
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    div, span, a, p {
      margin-bottom: ${props => props.md || props.space || '16px'};
    }
  }
  @media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
    div, span, a, p {
      margin-bottom: ${props => props.md || props.space || '16px'};
    }
  }
  @media (min-width: 577px) and (max-width: 767px) {
    div, span, a, p {
      margin-bottom: ${props => props.sm || props.space || '16px'};
    }
  }
  @media (min-width: 320px) and (max-width: 576px) {
    div, span, a, p {
      margin-bottom: ${props => props.xs || props.space || '16px'};
    }
  }
  @media (max-width: 320px) {
    div, span, a, p {
      margin-bottom: ${props => props.xs || props.space || '16px'};
    }
  }
`

export default Vstack
