import styled from 'styled-components'

const Label = styled.div`
div, span, strong, b {
  float: left;
  margin-bottom: ${props => props.y || '8px'};
  margin-right: ${props => props.x || '8px'};
  &.primary {
    color: ${props => props.theme.color.primary['900']};
  }
}
`
export default Label
