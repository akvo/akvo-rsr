import styled from 'styled-components'

const Heading = styled.div`
  font-family: ${props => props.thin ? props.theme.font.family : props.theme.font.heading.family};
  font-weight: ${props => props.theme.font.weight[props.type || 'normal']};
  font-size: ${props => props.theme.font.heading[props.size || 'md']};
  font-style: normal;
`

export default Heading
