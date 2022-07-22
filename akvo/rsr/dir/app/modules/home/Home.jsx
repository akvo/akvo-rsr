import React, { Fragment, useState, useRef, useEffect } from 'react'
import { Button, Spin, Collapse, Drawer } from 'antd'
import { Container, Row, Col, Visible, Hidden } from 'react-awesome-styled-grid'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import { Icon } from '../components/Icon'
import { Button as ButtonRsr, Paragraph, Title, Card, NavItem, Mark } from '../components/rsr'
import { scheduleDemoUrl, images, footerUrl } from '../../utils/config'
import { Section } from './Section'
import { homePage } from '../../utils/ui-text'
import { Space } from './Space'
import { queryUser } from '../project-page/queries'
import jsonWorks from '../../json/how-it-works.json'
import jsonFeatures from '../../json/features.json'
import jsonPartners from '../../json/partners.json'
import ProjectSection from '../main/sections/ProjectSection'
import ContactForm from '../main/sections/ContactForm'
import BlogSection from '../main/sections/BlogSection'
import PartnerSection from '../main/sections/PartnerSection'
import FooterSection from '../main/sections/FooterSection'

const Home = () => {
  const { data: user, error: apiError } = queryUser()

  const [loading, setLoading] = useState(true)
  const [drawer, setDrawer] = useState(false)
  const slider = useRef()
  const { t } = useTranslation()

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
    <Fragment>
      <Section>
        <Container>
          <Space y={{ lg: '24px', md: '16px', sm: '8px' }}>
            <Row>
              <Col sm={2} md={2} align="flex-start">
                <Link to="/">
                  <Icon type="logo.rsr" />
                </Link>
              </Col>
              <Col sm={2} md={2} lg={1} offset={{ sm: 1, md: 4, lg: 7 }} justify="center">
                <Hidden xs>
                  {(!loading && apiError) && (
                    <Button href="/my-rsr/" target="_blank" rel="noopener noreferrer" type="link">{homePage.signIn}</Button>
                  )}
                </Hidden>
              </Col>
              <Col sm={3} md={4} lg={2} justify="center" align="flex-end">
                {loading && <Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} spinning />}
                <Visible xs>
                  <Button type="link" onClick={() => setDrawer(!drawer)}>
                    <Icon type="menu" />
                  </Button>
                </Visible>
                <Hidden xs>
                  {(!loading && apiError) && (
                    <ButtonRsr type="button" href={scheduleDemoUrl} block>
                      {homePage.scheduleDemo}
                    </ButtonRsr>
                  )}
                  {(user && !loading && !apiError) && (
                    <ButtonRsr type="button" href="/my-rsr/" blank block>
                      {homePage.myProject}
                    </ButtonRsr>
                  )}
                </Hidden>
              </Col>
            </Row>
          </Space>
          <Space>
            <Row>
              <Col sm={8} md={8} lg={8} xl={8} justify="center" align="flex-start">
                {homePage.jumbotron.marker.map((text, x) => <Mark key={x}>{text}</Mark>)}
                <Paragraph>{homePage.jumbotron.paragraph1}</Paragraph>
                <Paragraph>{homePage.jumbotron.paragraph2}</Paragraph>
              </Col>
              <Hidden xs>
                <Col md={4} lg={3} xl={3} justify="center" style={{ display: 'block' }}>
                  <Icon type="home.monitoring" />
                </Col>
              </Hidden>
            </Row>
          </Space>
        </Container>
      </Section>
      <Section gray>
        <Container>
          <Row>
            <Col align="center" sm={8}>
              <Title>{homePage.howItWorks}</Title>
            </Col>
          </Row>
          <Space y={{ lg: '32px', md: '16px', sm: '8px' }}>
            <Hidden md>
              <Row>
                {jsonWorks.map(work => (
                  <Col lg={3} md={6} sm={4} xs={8} key={work.id}>
                    <Card>
                      <Icon type={`hwork.${work.image}`} width="64px" />
                      <h2 className="title">{work.title}</h2>
                      <p className="description">{work.description}</p>
                      <Hidden xs>
                        {work.id < 4 && (
                          <Card.Arrow>
                            <Icon type="chevron.right" />
                          </Card.Arrow>
                        )}
                      </Hidden>
                      <Visible xs>
                        {work.id < 4 && (
                          <Card.Arrow className="bottom">
                            <Icon type="chevron.right" />
                          </Card.Arrow>
                        )}
                      </Visible>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Hidden>
            <Visible md>
              <Row>
                {jsonWorks.slice(0, 2).map(work => (
                  <Col md={6} key={work.id} justify="center" align="center">
                    <Card>
                      <Icon type={`hwork.${work.image}`} width="56px" />
                      <h2 className="title">{work.title}</h2>
                      <p className="description">{work.description}</p>
                      <Card.Arrow className={classNames({ bottom: work.id === 2 })}>
                        <Icon type="chevron.right" />
                      </Card.Arrow>
                    </Card>
                  </Col>
                ))}
              </Row>
              <Row reverse>
                {jsonWorks.slice(2).map(work => (
                  <Col md={6} key={work.id}>
                    <Card>
                      <Icon type={`hwork.${work.image}`} width="56px" />
                      <h2 className="title">{work.title}</h2>
                      <p className="description">{work.description}</p>
                      {work.id === 4 && (
                        <Card.Arrow>
                          <Icon type="chevron.left" />
                        </Card.Arrow>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>
            </Visible>
          </Space>
          <Row justify="center">
            <Col xl={7} lg={7} md={8}>
              <Title>{homePage.monitorTheImpact.title}</Title>
              <Space y={{ lg: '16px', md: '16px', sm: '16px' }}>
                <Paragraph>{homePage.monitorTheImpact.description}</Paragraph>
              </Space>
              <Row>
                <Col xl={4} lg={4} md={6}>
                  <ButtonRsr type="button" href={scheduleDemoUrl} block>
                    {homePage.scheduleDemo}
                  </ButtonRsr>
                </Col>
              </Row>
            </Col>
            <Col xl={4} lg={4} md={4} align="flex-start">
              <Hidden xs>
                <Icon type="home.rsr" width="295px" />
              </Hidden>
            </Col>
          </Row>
          <Row justify="space-around">
            <Col xl={5} lg={5} md={6}>
              <Title className="features">{homePage.features}</Title>
              <ul className="disc">
                {homePage.featureItems.map((feature, vx) => (
                  <li key={vx}>{feature}</li>
                ))}
              </ul>
            </Col>
            <Col xl={5} lg={5} md={6} align="flex-start">
              <Collapse
                bordered={false}
                expandIcon={({ isActive }) => <Icon type={isActive ? 'minus' : 'plus'} />}
                className="feature-collapsible"
                expandIconPosition="right"
              >
                {jsonFeatures.map((item) => (
                  <Collapse.Panel header={item.title} key={item.id}>
                    {item.description}
                  </Collapse.Panel>
                ))}
              </Collapse>
            </Col>
          </Row>
        </Container>
      </Section>
      <Section>
        <Container>
          <Row>
            <Col align="center">
              <Title>{homePage.activeProject}</Title>
            </Col>
          </Row>
        </Container>
        <ProjectSection />
      </Section>
      <ContactForm />
      <Hidden xs>
        <Section gray id="rsr-case-studies">
          <Space y={{ lg: '32px', md: '24px' }}>
            <Container>
              <BlogSection />
            </Container>
          </Space>
        </Section>
      </Hidden>
      <Section id="rsr-partners">
        <Container>
          <Row justify="center">
            <Col>
              <Title size="sm">{homePage.trustedPartner}</Title>
            </Col>
          </Row>
          <Space y={{ lg: '45px', md: '32px', sm: '20px' }}>
            <PartnerSection
              slider={slider}
              partners={jsonPartners}
              onPrev={prevPartner}
              onNext={nextPartner}
            />
          </Space>
        </Container>
      </Section>
      <Section gray id="rsr-footer-home">
        <Container>
          <FooterSection {...{ images, footerUrl }} />
        </Container>
      </Section>
      <Drawer title="Menu" placement="right" visible={drawer} onClose={() => setDrawer(!drawer)} closable>
        {(!loading && apiError) && (
          <ul>
            <li>
              <Link to={scheduleDemoUrl}>
                <NavItem>
                  {homePage.scheduleDemo}
                </NavItem>
              </Link>
            </li>
            <li>
              <a href="/my-rsr/" target="_blank" rel="noopener noreferrer">
                <NavItem>
                  {homePage.signIn}
                </NavItem>
              </a>
            </li>
          </ul>
        )}
        {(user && !loading && !apiError) && (
          <ul>
            <li>
              <a href="/my-rsr/my-details/">
                <NavItem>
                  {t('My details')}
                </NavItem>
              </a>
            </li>
            <li>
              <a href="/en/sign_out">
                <NavItem>
                  {t('Sign out')}
                </NavItem>
              </a>
            </li>
          </ul>
        )}
      </Drawer>
    </Fragment>
  )
}

export default Home
