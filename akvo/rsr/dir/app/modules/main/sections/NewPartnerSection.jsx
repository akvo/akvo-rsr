import React from 'react'
import styled from 'styled-components'
import { Container } from 'react-awesome-styled-grid'
import { Flex } from '../../components'
import jsonPartners from '../../../json/partners.json'

const NewPartnerSection = () => {
  const Wrapper = styled(Flex)`
    flex-wrap: wrap;
    margin: 0 auto;
    img {
      width: 123px;
      height: 69px;
    }
  `
  return (
    <Container>
      <Wrapper justify="center">
        {
          jsonPartners.map((p, px) => (
            <div key={px}>
              <img src={p.image} alt={`partner ${px}`} />
            </div>
          ))
        }
      </Wrapper>
    </Container>
  )
}

export default NewPartnerSection
