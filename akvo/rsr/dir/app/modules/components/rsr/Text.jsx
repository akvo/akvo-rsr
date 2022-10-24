import styled from 'styled-components'

const Text = styled.div`
  font-family: ${props => props.theme.font.family};
  font-weight: ${props => props.theme.font.weight[props.type || 'normal']};
  font-size: ${props => props.theme.font.size[props.size || 'md']};
  font-style: normal;
`

export default Text
