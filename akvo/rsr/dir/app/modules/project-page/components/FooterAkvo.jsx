import React from 'react'
import styled from 'styled-components'
import akvoLogo from '../../../images/akvo.png'
import { Flex } from '../../components'

const Wrapper = styled(Flex)`
  justify-items: center;
  align-items: center;
  padding: 18px 16px 16px 16px;
  strong {
    font-weight: ${props => props.theme.font.weight.bold};
    color: #000;
  }
`

const FooterAkvo = () => {
  return (
    <Wrapper gap="12px">
      <span>
        <strong>Powered by</strong>
      </span>
      <span>
        <a href="//akvo.org" target="_blank" rel="noopener noreferrer">
          <img alt="Akvo Logo" src={akvoLogo} width="80" />
        </a>
      </span>
    </Wrapper>
  )
}

export default FooterAkvo
