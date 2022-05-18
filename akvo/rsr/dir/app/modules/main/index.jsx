import React, { useRef } from 'react'
import {
  Button,
  Row,
  Col,
  Typography
} from 'antd'

import '../../styles/home-page.scss'
import jsonWorks from '../../json/how-it-works.json'
import jsonFeatures from '../../json/features.json'
import jsonPartners from '../../json/partners.json'

import { footerUrl, images } from '../../utils/config'
import { RsrLayout } from '../components/layout'
import { queryUser } from '../project-page/queries'
import { Sections } from './sections'
import RsrButton from '../components/RsrButton'
import Section from '../components/Section'

const { Title } = Typography

const Main = () => {
  const { data: user } = queryUser()
  const slider = useRef()

  const prevPartner = () => {
    slider.current.prev()
  }
  const nextPartner = () => {
    slider.current.next()
  }
  return (
    <RsrLayout.Main id="rsr-home-page">
      <RsrLayout.Header.WithLogo style={{ height: 'auto' }} left={[4, 4, 8, 24, 24]} right={[20, 20, 16, 24, 24]}>
        <Row type="flex" align="middle" justify="end">
          {user && <Col span={6}><Button type="link" href="/my-rsr">My Projects</Button></Col>}
          {!(user) && (
            <>
              <Col lg={2} md={4} sm={12} xs={12}>
                <Button type="link" href="/my-rsr/" target="_blank" rel="noopener noreferrer">
                  <b>Sign in</b>
                </Button>
              </Col>
              <Col lg={4} md={10} sm={12} xs={12}>
                <RsrButton.External block>
                  <b>Schedule Demo</b>
                </RsrButton.External>
              </Col>
            </>
          )}
        </Row>
      </RsrLayout.Header.WithLogo>
      <Section className="rsr-hero">
        <Sections.JumboTron images={images} />
      </Section>
      <Section>
        <Sections.Works
          works={jsonWorks}
          features={jsonFeatures}
          images={images}
        />
      </Section>
      <Row className="rsr-row" id="rsr-active-projects">
        <Col className="text-center mb-3">
          <Title>Active Projects</Title>
        </Col>
        <Sections.Project />
        <Sections.ContactForm />
      </Row>
      <Section id="rsr-case-studies">
        <Sections.Blog />
      </Section>
      <Section id="rsr-partners">
        <Row
          type="flex"
          justify="center"
          style={{
            marginTop: '-110px',
            marginBottom: '2em'
          }}
        >
          <Col lg={8} md={11} sm={22}>
            <Title level={2}>Trusted Partners</Title>
          </Col>
          <Col lg={14} md={13} sm={2} />
        </Row>
        <Sections.Partner
          slider={slider}
          partners={jsonPartners}
          onPrev={prevPartner}
          onNext={nextPartner}
        />
      </Section>
      <Section id="rsr-footer-home">
        <Sections.Footer {...{ images, footerUrl }} />
      </Section>
    </RsrLayout.Main>
  )
}

export default Main
