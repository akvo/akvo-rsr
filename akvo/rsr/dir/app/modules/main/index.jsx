import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  Row,
  Col,
  Typography,
  Spin,
  Icon
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
  const { data: user, error: apiError } = queryUser()

  const [loading, setLoading] = useState(true)
  const slider = useRef()

  const prevPartner = () => {
    slider.current.prev()
  }
  const nextPartner = () => {
    slider.current.next()
  }

  useEffect(() => {
    if ((loading && apiError) || (loading && user && !apiError)) {
      setLoading(false)
    }
  }, [loading, user, apiError])
  return (
    <RsrLayout.Main id="rsr-home-page">
      <RsrLayout.Header.WithLogo style={{ height: 'auto' }} left={[3, 3, 6, 8, 8]} right={[21, 21, 18, 16, 16]}>
        <Row type="flex" align="middle" justify="end">
          {(user && !loading && !apiError) && <Col lg={4} md={6} sm={18} xs={18} className="text-right"><RsrButton.External href="/my-rsr" block blank>My Projects</RsrButton.External></Col>}
          {(!loading && apiError) && (
            <>
              <Col lg={2} md={4} sm={8} xs={8}>
                <Button type="link" href="/my-rsr/" target="_blank" rel="noopener noreferrer">
                  <b>Sign in</b>
                </Button>
              </Col>
              <Col lg={4} md={10} sm={16} xs={16}>
                <RsrButton.External block>
                  <b>Schedule Demo</b>
                </RsrButton.External>
              </Col>
            </>
          )}
          {loading && <Col lg={2} md={4} sm={8} xs={8}><Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} spinning /></Col>}
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
          className="title"
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
