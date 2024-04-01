import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-awesome-styled-grid'
import moment from 'moment'

import {
  MobileDrawer,
  Title,
  Header,
  Section,
  Space,
} from '../components'

import { homePage } from '../../utils/ui-text'
import { queryUser } from '../project-page/queries'
import '../../styles/home-page.scss'

import {
  JumboTron,
  WorksSection,
  ProjectSection,
  ContactForm,
  FooterSection,
  NewPartnerSection,
} from '../main/sections'
import CaseStudies from '../main/sections/CaseStudies'

const Home = () => {
  const { data: user, error: apiError } = queryUser()

  const [loading, setLoading] = useState(true)
  const [drawer, setDrawer] = useState(false)

  const toggleDrawer = () => setDrawer(!drawer)

  useEffect(() => {
    if ((loading && apiError) || (loading && user && !apiError)) {
      setLoading(false)
    }
  }, [loading, user, apiError])
  return (
    <div id="rsr-design-system">
      <Section>
        <Container>
          <Space y={{ lg: '24px', md: '16px', sm: '8px' }}>
            <Header
              {...{
                user,
                loading,
                apiError,
                toggleDrawer,
              }}
            />
          </Space>
          <Space y={{ sm: '64px', xs: '64px' }}>
            <JumboTron />
          </Space>
        </Container>
      </Section>
      <Section gray>
        <WorksSection />
      </Section>
      <Section>
        <Container>
          <Row>
            <Col align="center">
              <Title as="h1" type="bold">{homePage.activeProject}</Title>
            </Col>
          </Row>
        </Container>
      </Section>
      <ProjectSection />
      <ContactForm />
      <Section gray id="rsr-case-studies">
        <Container>
          <CaseStudies />
        </Container>
      </Section>

      <Section id="rsr-partners">
        <Container>
          <Row justify="center">
            <Col align="center">
              <Title as="h1" type="bold">{homePage.trustedPartner}</Title>
            </Col>
          </Row>
          <Space y={{ lg: '45px', md: '32px', sm: '20px' }}>
            <NewPartnerSection />
          </Space>
        </Container>
      </Section>
      <Section gray id="rsr-footer-home">
        <Container>
          <FooterSection />
          <div style={{ marginTop: '3em' }}>
            <span>All rights Reserved © {moment().format('YYYY')} | <a href="https://akvo.org/akvo-rsr-privacy-policy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a></span>
          </div>
        </Container>
      </Section>
      <MobileDrawer
        {...{
          apiError,
          loading,
          user
        }}
        visible={drawer}
        onClose={toggleDrawer}
      />
    </div>
  )
}

export default Home
