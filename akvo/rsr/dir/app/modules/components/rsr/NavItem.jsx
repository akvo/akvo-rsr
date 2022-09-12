import styled from 'styled-components'

export const NavItem = styled.span`
  display: flex;
  text-transform: uppercase;
  line-height: 42px;
  align-items: center;
  transition: all .3s ease-out;
  font-weight: ${props => props.theme.font.weight.medium};
  color: ${props => props.theme.color.gray['500']};
  &:hover {
    color: ${props => props.theme.color.primary['700']};
  }
`
